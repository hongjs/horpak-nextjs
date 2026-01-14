import validateReport from "../../../lib/validator";
import { ReportItem } from "../../../types/state";

describe("validateReport", () => {
  const validItem: ReportItem = {
    room: 101,
    name: "John Doe",
    water_start: 100,
    water_end: 110,
    water_unit_price: 18,
    water_unit: 10,
    water_min_cost: 0,
    water_cost: 180,
    electric_start: 1000,
    electric_end: 1050,
    electric_unit_price: 7,
    electric_unit: 50,
    electric_cost: 350,
    room_cost: 4000,
    share_cost: 0,
    internet_cost: 300,
    penalty_cost: 0,
    arrear: 0,
    electric_extra: "",
    electric_extra_cost: 0,
    water_extra: "",
    water_extra_cost: 0,
    other1: "",
    other1_cost: 0,
    other2: "",
    other2_cost: 0,
    other3: "",
    other3_cost: 0,
    bank_id: 1,
    total: 4830,
    // Note: The schema has additionalProperties: false, so we must be exact.
    // However, ReportItem type might have optional fields that are not in schema or vice versa.
    // Based on the schema provided, these match the 'required' list.
  } as unknown as ReportItem; // Casting because full ReportItem type might be larger than schema expects or match exactly.

  it("should return empty array for valid items", () => {
    const errors = validateReport([validItem]);
    expect(errors).toEqual([]);
  });

  it("should return error if room is not integer", () => {
    const invalidItem = { ...validItem, room: 101.5 }; // Integer required
    const errors = validateReport([invalidItem]);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain("must be integer");
  });

  it("should return error if required field is missing", () => {
    const invalidItem = { ...validItem };
    delete (invalidItem as any).water_cost;
    const errors = validateReport([invalidItem]);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain("must have required property 'water_cost'");
  });

  it("should return error if type is incorrect", () => {
    const invalidItem = { ...validItem, water_start: "100" }; // Integer required, string provided
    const errors = validateReport([invalidItem as any]);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain("must be integer");
  });

  it("should return error if additional property is present", () => {
    // schema says additionalProperties: false
    const invalidItem = { ...validItem, extra_unknown_field: "value" };
    const errors = validateReport([invalidItem as any]);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain("must NOT have additional properties");
  });
});
