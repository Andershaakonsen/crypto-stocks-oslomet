import classed from "tw-classed";
import { Button } from "./Button";

const UIPreview = () => {
    return (
        <div className="container mx-auto mt-12">
            <h1 className="text-4xl font-bold mb-4">UI Preview</h1>
            <Preview>
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
                <PreviewRow></PreviewRow>
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
