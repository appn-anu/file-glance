import { expect, describe, it } from "bun:test"

import { coerceColumnTypes } from "@/utils"

// Helper: build a single-column table from a list of cell values.
const col = (values: any[]): any[][] => values.map((v) => [v])

describe("coerceColumnTypes", () => {
  it("coerces a uniformly numeric column to numbers", () => {
    const data = col(["85000", "92000", "-3", "12.34"])
    coerceColumnTypes(data)
    expect(data.map((r) => r[0])).toEqual([85000, 92000, -3, 12.34])
    expect(typeof data[0][0]).toBe("number")
  })

  it("coerces scientific notation", () => {
    const data = col(["1e5", "-1.2e-3"])
    coerceColumnTypes(data)
    expect(data[0][0]).toBe(100000)
    expect(data[1][0]).toBe(-0.0012)
  })

  it("leaves leading-zero codes as strings (IDs / zip codes)", () => {
    const data = col(["007", "012", "02134"])
    coerceColumnTypes(data)
    expect(data.map((r) => r[0])).toEqual(["007", "012", "02134"])
  })

  it("does not coerce a mixed column (one stray non-number)", () => {
    const data = col(["1", "2", "N/A"])
    coerceColumnTypes(data)
    expect(data.map((r) => r[0])).toEqual(["1", "2", "N/A"])
  })

  it("keeps blanks as empty strings but still detects the column as numeric", () => {
    const data = col(["1", "", "3"])
    coerceColumnTypes(data)
    expect(data.map((r) => r[0])).toEqual([1, "", 3])
  })

  it("promotes integers beyond the safe range to BigInt", () => {
    const data = col(["900719925474099100", "900719925474099200"])
    coerceColumnTypes(data)
    expect(typeof data[0][0]).toBe("bigint")
    expect(data[0][0]).toBe(900719925474099100n)
  })

  it("rejects Infinity / NaN / hex literals", () => {
    for (const v of ["Infinity", "NaN", "0xFF", "+1"]) {
      const data = col([v, v])
      coerceColumnTypes(data)
      expect(data[0][0]).toBe(v)
    }
  })

  it("coerces a uniformly boolean column", () => {
    const data = col(["true", "false", "TRUE", "False"])
    coerceColumnTypes(data)
    expect(data.map((r) => r[0])).toEqual([true, false, true, false])
  })

  it("does not coerce a boolean-ish column with stray values", () => {
    const data = col(["true", "false", "maybe"])
    coerceColumnTypes(data)
    expect(data.map((r) => r[0])).toEqual(["true", "false", "maybe"])
  })

  it("handles ragged rows and per-column types independently", () => {
    const data: any[][] = [
      ["1", "true", "alpha"],
      ["2", "false"], // shorter row
      ["3", "true", "gamma", "extra"], // longer row
    ]
    coerceColumnTypes(data)
    expect(data[0]).toEqual([1, true, "alpha"])
    expect(data[1]).toEqual([2, false])
    expect(data[2]).toEqual([3, true, "gamma", "extra"])
  })

  it("leaves already-typed cells untouched and does not coerce such columns", () => {
    const data: any[][] = [[1], ["2"], [3]]
    coerceColumnTypes(data)
    // Column has a real number already -> defensively not coerced.
    expect(data.map((r) => r[0])).toEqual([1, "2", 3])
  })

  it("ignores all-blank columns", () => {
    const data = col(["", "", ""])
    coerceColumnTypes(data)
    expect(data.map((r) => r[0])).toEqual(["", "", ""])
  })

  it("no-ops on empty input", () => {
    const data: any[][] = []
    coerceColumnTypes(data)
    expect(data).toEqual([])
  })
})
