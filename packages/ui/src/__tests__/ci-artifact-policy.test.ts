// Origin: agent
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const WORKFLOW_DIR = resolve(__dirname, "..", "..", "..", "..", ".github", "workflows");

function readWorkflow(name: string): string {
  return readFileSync(resolve(WORKFLOW_DIR, name), "utf8");
}

describe("CI artifact storage policy", () => {
  it("keeps the capture build artifact only for no-tag manual dispatches for 7 days", () => {
    const workflow = readWorkflow("capture-build.yml");

    expect(workflow).toContain("if: github.event_name == 'workflow_dispatch' && inputs.release_tag == ''");
    expect(workflow).toContain("name: components-capture-build");
    expect(workflow).toContain("retention-days: 7");
    expect(workflow.match(/uses:\s*actions\/upload-artifact@/g)).toHaveLength(1);
  });

  it("keeps the roadmap Playwright report only after failure for 3 days", () => {
    const workflow = readWorkflow("e2e-storybook.yml");

    expect(workflow).toContain("if: failure()");
    expect(workflow).toContain("name: roadmap-playwright-report");
    expect(workflow).toContain("retention-days: 3");
    expect(workflow.match(/uses:\s*actions\/upload-artifact@/g)).toHaveLength(1);
  });
});
