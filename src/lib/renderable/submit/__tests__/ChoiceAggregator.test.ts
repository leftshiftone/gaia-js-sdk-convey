// import {ChoiceAggregator} from "../ChoiceAggregator";
// import * as sinon from "sinon";

import {ChoiceAggregator} from "../ChoiceAggregator";

describe("ChoiceAggregatorTest", () => {

    it("sieves input elements", () => {


        const containerGenerator = function* () {
            yield {
                dataset: { name: "first", sieve: "true"},
                querySelectorAll: (selector: string) => {
                    if (selector === "input[type='checkbox']") {
                        return [
                            {dataset: {name: "some element", type: "checkbox"}, checked: true},
                            {dataset: {name: "another element", type: "checkbox"}, checked: true},
                            {dataset: {name: "yet another element", type: "checkbox"}, checked: false},
                        ];
                    }
                    return [];
                }
            };
            yield {
                dataset: { name: "second", sieve: "false"},
                querySelectorAll: (selector: string) => {
                    if (selector === "input[type='checkbox']") {
                        return [
                            {dataset: {name: "a radio button", type: "radio"}, checked: false},
                            {dataset: {name: "another radio button", type: "radio"}, checked: true}
                        ];
                    }
                    return [];
                }
            };
        };

        const gen = containerGenerator();
        //@ts-ignore
        const result = ChoiceAggregator.aggregate({forEach: (cb) => {
                // @ts-ignore
                cb(gen.next().value);
                // @ts-ignore
                cb(gen.next().value);
            }});

        expect(result["first"]).not.toBeUndefined();
        expect(result["first"].length).toBe(2);
        // contains only true values
        expect(result["first"].reduce((acc: boolean, val: any) => acc && val.value, true)).toBe(true);
        expect(result["second"]).not.toBeUndefined();
        expect(result["second"].length).toBe(2);
        // contains only false values
        expect(result["second"].reduce((acc: boolean, val: any) => acc && val.value, true)).toBe(false);
    });
});
