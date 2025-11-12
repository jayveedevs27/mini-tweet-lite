import React from "react";
import { render } from "@testing-library/react";
import { UserProvider } from "../context/UserContext";

export function renderWithUser(ui, { user } = {}) {
  const defaultUser = user || {
    id: 1,
    first_name: "Jayvee",
    last_name: "Salango",
    profile_picture_url: "http://mini-tweet-lite.test/default-profile.png"
  };
  return render(
    <UserProvider value={{ user: defaultUser, setUser: vi.fn() }}>
      {ui}
    </UserProvider>
  );
}
