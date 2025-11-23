import { render, screen, fireEvent } from "@testing-library/react";
import StatsAccordionItem from "../components/StatsAccordionItem";

const sampleStats = {
  wins: 10,
  losses: 5,
  points_per_game: 25,
  game_details: { passing_yards_per_game: 280 },
  season_stats: { touchdowns: 30 }
};

test("renders sport name", () => {
  render(
    <StatsAccordionItem
      sport="Football"
      stats={sampleStats}
      isOpen={false}
      onToggle={() => {}}
      activeTab="quick"
      onTabChange={() => {}}
    />
  );

  expect(screen.getByText("Football")).toBeInTheDocument();
});

test("opens accordion", () => {
  const mockFn = vi.fn();

  render(
    <StatsAccordionItem
      sport="Football"
      stats={sampleStats}
      isOpen={false}
      onToggle={mockFn}
      activeTab="quick"
      onTabChange={() => {}}
    />
  );

  fireEvent.click(screen.getByText("Football"));
  expect(mockFn).toHaveBeenCalled();
});
