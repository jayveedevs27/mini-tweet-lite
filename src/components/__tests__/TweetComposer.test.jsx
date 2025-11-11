import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import TweetComposer from "../TweetComposer";
import api from "../../api";

// resets test api call in memory
beforeEach(() => {
  vi.clearAllMocks();
});

//mock api
vi.mock("../../api", () => ({
  default: { post: vi.fn() },
}));

describe("TweetComposer", () => {

  test("renders textarea and button", () => {
    render(<TweetComposer />);
    expect(
      screen.getByPlaceholderText("What's happening?")
    ).toBeInTheDocument();
    expect(screen.getByText("Tweet")).toBeInTheDocument();
  });

  test("updates character counter as user types", () => {
    render(<TweetComposer />);
    const textarea = screen.getByPlaceholderText("What's happening?");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    expect(screen.getByText(/275 characters remaining/i)).toBeInTheDocument();
  });

  test("submits tweet successfully and clears text", async () => {
    api.post.mockResolvedValueOnce({});
    const onPosted = vi.fn();
    render(<TweetComposer onPosted={onPosted} />);

    const textarea = screen.getByPlaceholderText("What's happening?");
      fireEvent.change(textarea, { target: { value: "My new tweet" } });
      
    const form = screen.getByRole("form", { name: /tweet composer form/i });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/tweets", {
        body: "My new tweet",
      });
      expect(onPosted).toHaveBeenCalled();
      expect(textarea.value).toBe("");
    });
  });

  test("does not submit empty tweet", () => {
    const onPosted = vi.fn();
    render(<TweetComposer onPosted={onPosted} />);
    const form = screen.getByRole("form", { name: /tweet composer form/i });
    fireEvent.submit(form);
    expect(api.post).not.toHaveBeenCalled();
    expect(onPosted).not.toHaveBeenCalled();
  });


  test("handles API errors gracefully", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    api.post.mockRejectedValueOnce(new Error("Failed to post"));
    render(<TweetComposer />);
    const textarea = screen.getByPlaceholderText("What's happening?");
      fireEvent.change(textarea, { target: { value: "Oops" } });
      const form = screen.getByRole("form", { name: /tweet composer form/i });
    fireEvent.submit(form);
    await waitFor(() => expect(errorSpy).toHaveBeenCalled());
    errorSpy.mockRestore();
  });
    
});
