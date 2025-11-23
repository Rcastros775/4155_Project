import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Bookmarks from "../pages/Bookmarks/Bookmarks";
import { vi } from "vitest";

vi.stubGlobal("localStorage", {
  getItem: () => "mock_token"
});

vi.mock("../services/bookmarks", () => ({
  getBookmarks: () =>
    Promise.resolve([
      {
        id: 1,
        sport: "football",
        home_team: "Charlotte",
        away_team: "ECU",
        date: "2025-10-10",
        time: "7:00 PM",
        stadium_location: "Jerry Richardson Stadium",
        image: ""
      }
    ])
}));

test("renders bookmarked games title", async () => {
  render(
    <MemoryRouter>
      <Bookmarks />
    </MemoryRouter>
  );

  expect(
    await screen.findByText("Your Bookmarked Events")
  ).toBeInTheDocument();
});