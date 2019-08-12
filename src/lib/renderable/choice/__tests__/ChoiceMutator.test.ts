import {ChoiceMutator} from "../ChoiceMutator";
import {ISpecification} from "../../../api";

describe("ChoiceMutatorTest", () => {

    it("does mutate types", () => {
        const fixture = [{
            elements: [{
                elements: [{
                    elements: [{
                        name: "DEU",
                        text: " ",
                        type: "choice",
                        class: "deu",
                        selected: true
                    }],
                    type: "col"
                }, {
                    elements: [{
                        name: "ENG",
                        text: " ",
                        type: "choice",
                        class: "eng",
                        selected: false
                    }],
                    type: "col"
                }, {
                    elements: [{
                        name: "FRA",
                        text: " ",
                        type: "choice",
                        class: "fra",
                        selected: false
                    }],
                    type: "col"
                }],
                type: "row"
            }, {
                elements: [{
                    elements: [{
                        text: "DEU",
                        type: "text"
                    }],
                    type: "col"
                }, {
                    elements: [{
                        text: "ENG",
                        type: "text"
                    }],
                    type: "col"
                }, {
                    elements: [{
                        text: "FRA",
                        type: "text"
                    }],
                    type: "col"
                }],
                type: "row"
            }],
            type: "table",
            class: "button-layout"
        }] as ISpecification[];

        // @ts-ignore
        ChoiceMutator.mutate(fixture, "testType");
        // @ts-ignore
        expect(fixture[0].elements[0].elements[0].elements[0].type).toBe("testType");
        // @ts-ignore
        expect(fixture[0].elements[0].elements[1].elements[0].type).toBe("testType");
        // @ts-ignore
        expect(fixture[0].elements[0].elements[2].elements[0].type).toBe("testType");
    });

});
