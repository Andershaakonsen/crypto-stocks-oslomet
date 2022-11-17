import classed from "@tw-classed/react";
import { Button } from "./Button";
import { Input, Select } from "./Input";

const UIPreview = () => {
    return (
        <div className="container mx-auto mt-12">
            <h1 className="text-4xl font-bold mb-4">UI Preview</h1>
            <Preview>
                <PreviewRowTitle>Button</PreviewRowTitle>
                <PreviewRow>
                    <PreviewItem>
                        <ItemTitle>*</ItemTitle>
                        <Button>Button</Button>
                    </PreviewItem>
                    <PreviewItem>
                        <ItemTitle>color:"green"</ItemTitle>
                        <Button color="green">Button</Button>
                    </PreviewItem>
                    <PreviewItem>
                        <ItemTitle>color:"slate"</ItemTitle>
                        <Button color="slate">Button</Button>
                    </PreviewItem>
                    <PreviewItem>
                        <ItemTitle>color:"red"</ItemTitle>
                        <Button color="red">Button</Button>
                    </PreviewItem>
                    <PreviewItem>
                        <ItemTitle>size:"sm"</ItemTitle>
                        <Button size="sm">Button</Button>
                    </PreviewItem>
                    <PreviewItem>
                        <ItemTitle>size:"md"</ItemTitle>
                        <Button size="md">Button</Button>
                    </PreviewItem>
                    <PreviewItem>
                        <ItemTitle>size:"lg"</ItemTitle>
                        <Button size="lg">Button</Button>
                    </PreviewItem>
                    <PreviewItem>
                        <ItemTitle>size:"xl"</ItemTitle>
                        <Button size="xl">Button</Button>
                    </PreviewItem>
                </PreviewRow>
                <PreviewRowTitle>Input</PreviewRowTitle>
                <PreviewRow>
                    <PreviewItem>
                        <ItemTitle>*</ItemTitle>
                        <Input placeholder="Regular" type="text" />
                    </PreviewItem>
                    <PreviewItem>
                        <ItemTitle>color:blue</ItemTitle>
                        <Input placeholder="Blue" type="text" color="blue" />
                    </PreviewItem>
                    <PreviewItem>
                        <ItemTitle>color:green</ItemTitle>
                        <Input
                            placeholder="Green / valid"
                            type="text"
                            color="green"
                        />
                    </PreviewItem>
                    <PreviewItem>
                        <ItemTitle>color:error</ItemTitle>
                        <Input
                            readOnly
                            type="text"
                            color="error"
                            value="errored"
                        />
                    </PreviewItem>
                </PreviewRow>
                <PreviewRowTitle>Select</PreviewRowTitle>
                <PreviewRow>
                    <PreviewItem>
                        <ItemTitle>*</ItemTitle>
                        <Select>
                            <option>Regular</option>
                            <option>Option 1</option>
                            <option>Option 2</option>
                            <option>Option 3</option>
                        </Select>
                    </PreviewItem>
                    <PreviewItem>
                        <ItemTitle>color:blue</ItemTitle>
                        <Select color="blue">
                            <option>Blue</option>
                            <option>Option 1</option>
                            <option>Option 2</option>
                            <option>Option 3</option>
                        </Select>
                    </PreviewItem>
                    <PreviewItem>
                        <ItemTitle>color:green</ItemTitle>
                        <Select color="green">
                            <option>Green / valid</option>
                            <option>Option 1</option>
                            <option>Option 2</option>
                            <option>Option 3</option>
                        </Select>
                    </PreviewItem>
                    <PreviewItem>
                        <ItemTitle>color:error</ItemTitle>
                        <Select color="error">
                            <option>Errored</option>
                            <option>Option 1</option>

                            <option>Option 2</option>
                            <option>Option 3</option>
                        </Select>
                    </PreviewItem>
                </PreviewRow>
            </Preview>
        </div>
    );
};

export default UIPreview;

const Preview = classed(
    "div",
    "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6"
);

const PreviewRowTitle = classed("span", "text-lg font-medium");
const PreviewRow = classed("div", "col-span-full flex gap-4");
const ItemTitle = classed("code", "text-sm font-medium text-radix-slate11");

const PreviewItem = classed(
    "div",
    "p-4 border-radix-slate6 border border-dotted shadow rounded-lg flex flex-col items-center justify-center gap-3"
);
