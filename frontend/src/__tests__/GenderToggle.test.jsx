import { render, screen, fireEvent } from "@testing-library/react";
import GenderToggle from "../components/GenderToggle";

test("switches gender", () => {
  const mockFn = vi.fn();

  render(<GenderToggle gender="men" onChange={mockFn} />);

  const womenBtn = screen.getByText(/Women/i);
  fireEvent.click(womenBtn);

  expect(mockFn).toHaveBeenCalledWith("women");
});