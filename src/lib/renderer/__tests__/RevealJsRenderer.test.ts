import {RevealJsRenderer} from "../RevealJsRenderer";
import {ISpecification} from "../../api";
import Renderables from "../../renderable/Renderables";
import {Text} from "../../renderable/text/index";
import {TextInput} from "../../renderable/textInput/index";
import {Submit} from "../../renderable/submit/index";
import {Form} from "../../renderable/form/index";
import {Container} from "../../renderable/container";


describe("Reveal Js Renderer test", () => {



    it("simple container test", () => {

        const gaiaDiv = document.createElement("div");
        gaiaDiv.classList.add("lto-gaia");

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("lto-content");

        const suggestDiv = document.createElement("div");
        suggestDiv.classList.add("lto-suggest");

        document.body.appendChild(gaiaDiv);
        document.body.appendChild(contentDiv);
        document.body.appendChild(suggestDiv);



        const specification = {
            "type" : "container",
            "elements": [{
                "class": "start-application",
                "elements": [
                    {
                        "class": "uppercase bold",
                        "text": "Bevor es losgeht, verrate uns bitte deinen Vornamen:",
                        "type": "text"
                    },
                    {
                        "elements": [
                            {
                                "name": "firstName",
                                "placeholder": "Vorname",
                                "required": true,
                                "type": "textinput"
                            },
                            {
                                "text": "Bewerbung starten",
                                "type": "submit"
                            }
                        ],
                        "type": "form"
                    }
                ],
                "type": "block"
            }]
        } as ISpecification;

        const revealJsRenderer = new RevealJsRenderer();
        Renderables.register("text", Text);
        Renderables.register("textinput", TextInput);
        Renderables.register("submit", Submit);
        Renderables.register("form", Form);
        Renderables.register("container", Container);

        const rendered = revealJsRenderer.render(specification);
        expect(rendered[0].localName).toBe("section");

    });


});
