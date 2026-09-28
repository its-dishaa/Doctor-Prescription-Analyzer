from pathlib import Path
import pandas as pd


class InvestigationLoader:

    def __init__(self):

        csv_path = (
            Path(__file__)
            .resolve()
            .parents[2]
            / "data"
            / "investigations.csv"
        )

        self.df = pd.read_csv(csv_path)

        self.df.fillna("", inplace=True)

    def get_dataframe(self):

        return self.df