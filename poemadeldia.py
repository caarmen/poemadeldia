"""
Write a random poem to standard output
"""
import argparse
import locale
import pathlib
import random
from datetime import datetime
from pathlib import Path
from typing import List, Protocol, runtime_checkable, Any, Dict

import pytz
from jinja2 import Environment, FileSystemLoader, select_autoescape
from sqlalchemy import create_engine, event, select
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session, InstrumentedAttribute
from sqlalchemy.sql.functions import count, func


# pylint: disable=too-few-public-methods
class PoemMeta(Protocol):
    """
    Poem meta info, to use in preparing queries.
    Protocol to allow us to use type hints with SQLAlchemy classes which are generated at runtime
    """

    poem_number: InstrumentedAttribute


@runtime_checkable
# pylint: disable=too-few-public-methods
class Poem(Protocol):
    """
    Information included in all Poem instances.
    Protocol to allow us to use type hints with SQLAlchemy classes which are generated at runtime
    """

    poem_number: str
    content: str
    year: str
    month: str


@runtime_checkable
# pylint: disable=too-few-public-methods
class MinimalPoem(Poem, Protocol):
    """
    Poem class with only the minimal fields, declared in the common base class
    Protocol to allow us to use type hints with SQLAlchemy classes which are generated at runtime
    """


@runtime_checkable
# pylint: disable=too-few-public-methods
class FullPoem(MinimalPoem, Protocol):
    """
    Poem class with additional fields
    Protocol to allow us to use type hints with SQLAlchemy classes which are generated at runtime
    """

    location: str
    title: str
    pre_content: str
    day: str


class PoemPicker:
    """
    Selects a random poem
    """

    # Follow sqlalchemy naming convention
    # pylint: disable=invalid-name
    Base = automap_base()

    @staticmethod
    @event.listens_for(Base.metadata, "column_reflect")
    # pylint: disable=unused-argument
    def _mark_poem_number_as_pk(inspector, table, column_info):
        # Our db doesn't have primary keys.
        # Indicating that poem_number should be treated as a pk allows us to
        # access poem tables with Base.classes.
        if column_info["name"] == "poem_number":
            column_info["primary_key"] = True

    def __init__(self, db_path):
        self.engine = create_engine(
            f"sqlite+pysqlite:///{db_path}", echo=False, future=True
        )
        PoemPicker.Base.prepare(autoload_with=self.engine)

    @staticmethod
    def _select_random_poem_class(
        session: Session,
        poem_classes: List[PoemMeta],
    ) -> PoemMeta:
        """
        :return: a poem class randomnly, proportionally to the number of poems each class has.
        """
        total_poem_count = 0
        # number of poems for each poem class plus the poem counts of poem classes before it:
        cumulative_poem_counts = []

        for poem_class in poem_classes:
            poem_count = session.execute(
                select(count(poem_class.poem_number))
            ).scalar_one()
            total_poem_count += poem_count
            cumulative_poem_counts.append(total_poem_count)

        random_poem_index = random.randint(1, total_poem_count)
        random_poem_class_index = next(
            index
            for index in range(len(poem_classes))
            if cumulative_poem_counts[index] >= random_poem_index
        )
        poem_class = poem_classes[random_poem_class_index]
        return poem_class

    @staticmethod
    def _select_random_poem(session: Session, poem_class: PoemMeta) -> Poem:
        poem = session.scalars(
            select(poem_class).order_by(func.random()).limit(1)
        ).first()
        return poem

    def pick_poem(self) -> Poem:
        """
        :return: a poem randomnly selected from the database
        """
        with Session(self.engine) as session:
            poem_classes = sorted(self.Base.classes, key=lambda x: x.__name__)
            random_poem_class = self._select_random_poem_class(session, poem_classes)
            return self._select_random_poem(session, random_poem_class)


class Renderer:
    """
    Renders a poem and its metadata as text
    """

    def __init__(self):
        self.folder = Path(__file__).parent
        self.env = Environment(
            loader=FileSystemLoader(searchpath=self.folder),
            autoescape=select_autoescape(),
        )
        locale.setlocale(locale.LC_TIME, "es_ES.UTF-8")

    @staticmethod
    def _template_name(poem: Poem) -> str:
        if isinstance(poem, FullPoem):
            return "full"
        return "minimal"

    @staticmethod
    def _poem_date(poem: Poem) -> str:
        if isinstance(poem, FullPoem):
            return datetime(
                year=int(poem.year), month=int(poem.month), day=int(poem.day)
            ).strftime("%-d de %B de %Y")
        return datetime(year=int(poem.year), month=int(poem.month), day=1).strftime(
            "%B de %Y"
        )

    def _template_data(self, poem: Poem) -> Dict[str, Any]:
        return {
            "poem_date": self._poem_date(poem),
            "updated": datetime.now(tz=pytz.UTC).isoformat(),
            "poem": poem,
        }

    def render(self, poem: Poem) -> str:
        """
        :param poem: the poem to render
        :return: the poem and metadata rendered as text
        """
        template_name = self._template_name(poem)
        template = self.env.get_template(f"templates/{template_name}.rss.j2")
        template_data = self._template_data(poem)
        return template.render(**template_data)


def main():
    """
    Entry point to the program
    """

    parser = argparse.ArgumentParser(
        description="Print a random poem from a database and templates"
    )
    parser.add_argument("db", type=pathlib.Path, help="Path to the poems database")
    args = parser.parse_args()

    poem = PoemPicker(args.db).pick_poem()
    output = Renderer().render(poem)
    print(output)


if __name__ == "__main__":
    main()
