/*

The MIT License (MIT)

Copyright (c) 2015 Thomas Bluemel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

import { Document } from "./Document";
import { RTFJSError } from "./Helper";
import { Parser } from "./parser/Parser";
import { IContainerElement, Renderer } from "./renderer/Renderer";

export interface ISettings {
    onHyperlink?(create: () => HTMLElement, hyperlink: { url: () => string }): IContainerElement;

    /**
     * Callback which is called with information about the type of picture and a function to render it.
     * The callback can then decide the output to be rendered.
     * @param isLegacy Null if the picture is the only one provided. Otherwise specifies whether the picture
     * is a legacy picture (e.g. if both an emf and a wmf version of a picture are available).
     * @param create A function which returns the result of rendering the picture.
     * @return The {HTMLElement} you want to display
     */
    onPicture?(isLegacy: null | boolean, create: () => HTMLElement): HTMLElement;

    onImport?(relUrls: string, callback: (data: {
        error?: Error, keyword?: string, blob?: ArrayBuffer,
        width?: number, height?: number
    }) => void): void;
}

export class DocumentFacade {
    private _document: Document;
    private _renderer: Renderer;
    private _parsed: Promise<void>;

    constructor(blob: ArrayBuffer, settings: ISettings) {
        this._document = new Document(settings);
        this._renderer = new Renderer(this._document);
        const parser = new Parser(this._document, blob, this._renderer);
        this._parsed = parser.parse();
    }

    public metadata(): { [key: string]: any } {
        return this._document._meta;
    }

    public render(): Promise<HTMLElement[]> {
        return this._parsed
            .then(() => {
                return this._renderer.buildDom();
            }).catch((error) => {
                throw new RTFJSError(error);
            });
    }

}
