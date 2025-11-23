import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Events from "../pages/Events/Events";
import { vi } from "vitest";

vi.mock("../services/events", () => ({
  getEvents: () =>
    Promise.resolve([
      {
        id: 1,
        sport: "football",
        stadium_location: "Jerry Richardson Stadium",
        date: "2025-10-10",
        time: "7:00 PM",
        home_team: "Charlotte",
        away_team: "Duke",
        image: ""
      },
      {
        id: 2,
        sport: "soccer",
        stadium_location: "Transamerica Field",
        date: "2025-11-02",
        time: "6:00 PM",
        home_team: "UNCC",
        away_team: "ECU",
        image: ""
      }
    ])
}));

test("renders Events title", () => {
  render(
    <MemoryRouter>
      <Events />
    </MemoryRouter>
  );

  expect(screen.getByText(/Events/i)).toBeInTheDocument();
});

test("renders filter dropdowns", async () => {
  render(
    <MemoryRouter>
      <Events />
    </MemoryRouter>
  );

  expect(
    await screen.findByLabelText(/Filter by Location/i)
  ).toBeInTheDocument();

  expect(screen.getByLabelText(/Sort by/i)).toBeInTheDocument();
});

test("filters events by location", async () => {
  render(
    <MemoryRouter>
      <Events />
    </MemoryRouter>
  );

  const select = await screen.findByLabelText(/Filter by Location/i);

  fireEvent.change(select, {
    target: { value: "Transamerica Field" }
  });

  await waitFor(() => {
    expect(screen.getByText(/UNCC vs ECU/i)).toBeInTheDocument();
    expect(screen.queryByText(/Charlotte vs Duke/i)).not.toBeInTheDocument();
  });
});