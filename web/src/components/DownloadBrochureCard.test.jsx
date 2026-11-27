import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import DownloadBrochureCard from "./DownloadBrochureCard.jsx";

const ERROR = "Unable to generate brochure (demo)";
const HELPER = "Demo file generated in-browser";

function setSearch(search) {
  window.history.pushState({}, "", `/${search}`);
}

describe("DownloadBrochureCard", () => {
  let createSpy;
  let revokeSpy;
  let clickSpy;
  let downloadName;

  beforeEach(() => {
    downloadName = undefined;
    URL.createObjectURL = vi.fn(() => "blob:demo");
    URL.revokeObjectURL = vi.fn();
    createSpy = URL.createObjectURL;
    revokeSpy = URL.revokeObjectURL;
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function () {
      downloadName = this.download;
    });
    setSearch("");
  });

  afterEach(() => {
    cleanup();
    clickSpy.mockRestore();
  });

  it("shows helper text and no error initially", () => {
    render(<DownloadBrochureCard />);
    expect(screen.getByTestId("download-brochure-helper-text").textContent).toBe(HELPER);
    expect(screen.queryByTestId("download-brochure-error")).toBeNull();
  });

  it("downloads tour-brochure.pdf via Blob URL and revokes it", () => {
    render(<DownloadBrochureCard />);
    fireEvent.click(screen.getByTestId("download-brochure-button"));
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy.mock.calls[0][0]).toBeInstanceOf(Blob);
    expect(downloadName).toBe("tour-brochure.pdf");
    expect(revokeSpy).toHaveBeenCalledWith("blob:demo");
  });

  it("?simulate_error=true shows inline error, hides helper, and creates no file", () => {
    setSearch("?simulate_error=true");
    render(<DownloadBrochureCard />);
    fireEvent.click(screen.getByTestId("download-brochure-button"));
    expect(screen.getByTestId("download-brochure-error").textContent).toBe(ERROR);
    expect(screen.queryByTestId("download-brochure-helper-text")).toBeNull();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("clears the error on the next valid download", () => {
    setSearch("?simulate_error=true");
    render(<DownloadBrochureCard />);
    fireEvent.click(screen.getByTestId("download-brochure-button"));
    expect(screen.getByTestId("download-brochure-error")).toBeTruthy();

    setSearch("");
    fireEvent.click(screen.getByTestId("download-brochure-button"));
    expect(screen.queryByTestId("download-brochure-error")).toBeNull();
    expect(screen.getByTestId("download-brochure-helper-text").textContent).toBe(HELPER);
    expect(createSpy).toHaveBeenCalledTimes(1);
  });
});
