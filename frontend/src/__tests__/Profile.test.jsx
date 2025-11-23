import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "../pages/Profile/Profile";
import { vi } from "vitest";

vi.mock("../services/profile", () => ({
  getMyProfile: () =>
    Promise.resolve({ username: "testuser", email: "test@example.com" }),

  updateProfile: () =>
    Promise.resolve({ ok: true, username: "newname" })
}));

test("loads user profile", async () => {
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  );

  expect(await screen.findByText(/testuser/i)).toBeInTheDocument();
  expect(await screen.findByText(/test@example.com/i)).toBeInTheDocument();
});

test("switches to edit mode", async () => {
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  );


  fireEvent.click(await screen.findByText("Edit Profile"));


  expect(screen.getByText("Save Changes")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("New username")).toBeInTheDocument();
});