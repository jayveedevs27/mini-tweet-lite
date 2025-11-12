import { renderWithUser } from "../../utils/testUtils";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import TweetCard from "../TweetCard";
import api from "../../api";

// resets test api call in memory
beforeEach(() => {
  vi.clearAllMocks();
});

// mock api
vi.mock("../../api", () => ({
  default: { post: vi.fn() },
}));

describe("TweetCard", () => {
  const baseTweet = {
    id: 1,
    body: "Hello world",
    user: { first_name: "Jayvee", last_name: "Salango" },
    created_at: new Date().toISOString(),
    liked_by_me: false,
    likes_count: 2,
  };

  test("renders tweet content and author", () => {
    renderWithUser(<TweetCard tweet={baseTweet} />);
    expect(screen.getByText("Jayvee Salango")).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  test("displays initial likes count", () => {
    renderWithUser(<TweetCard tweet={baseTweet} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("calls API and toggles like", async () => {
    api.post.mockResolvedValueOnce({ data: { liked: true, likes_count: 3 } });
    const onLikeToggle = vi.fn();
    renderWithUser(<TweetCard tweet={baseTweet} onLikeToggle={onLikeToggle} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/tweets/1/like");
      expect(onLikeToggle).toHaveBeenCalledWith(1, true);
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  test("handles unlike toggle correctly", async () => {
    api.post.mockResolvedValueOnce({ data: { liked: false, likes_count: 1 } });
    const onLikeToggle = vi.fn();
    renderWithUser(
      <TweetCard
        tweet={{ ...baseTweet, liked_by_me: true, likes_count: 2 }}
        onLikeToggle={onLikeToggle}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(onLikeToggle).toHaveBeenCalledWith(1, false);
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  test("handles API errors gracefully", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    api.post.mockRejectedValueOnce(new Error("Network Error"));

    renderWithUser(<TweetCard tweet={baseTweet} />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
    });
    errorSpy.mockRestore();
  });
});
