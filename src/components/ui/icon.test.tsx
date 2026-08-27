import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Icon } from "./icon";

describe("Icon", () => {
  it("renders lucide icon", () => {
    const { container } = render(<Icon name="lucide:rocket" />);
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
  it("fallback for unknown", () => {
    const { container } = render(<Icon name="unknown-icon" />);
    expect(container.innerHTML).toContain("svg");
  });
});
