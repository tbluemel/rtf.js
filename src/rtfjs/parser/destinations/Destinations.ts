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

import { Document } from "../../Document";
import { GlobalState } from "../Containers";
import { ColortblDestination } from "./ColortblDestinations";
import {
    DestinationFactory,
    GenericPropertyDestinationFactory,
    GenericSubTextPropertyDestinationFactory,
    RequiredDestinationFactory,
} from "./DestinationBase";
import { FieldDestination, FldinstDestination, FldrsltDestination } from "./FieldDestinations";
import { FonttblDestination } from "./FonttblDestinations";
import { InfoDestination,
    MetaPropertyDestinationFactory,
    MetaPropertyTimeDestinationFactory } from "./MetaDestinations";
import { PictDestination, PictGroupDestinationFactory } from "./PictDestinations";
import { RtfDestination } from "./RtfDestination";
import { StylesheetDestination } from "./StylesheetDestination";

export const Destinations
    : {[key: string]
        : ((new (parser: GlobalState, inst: Document, name: string, param: number) => any)
        | DestinationFactory<any>)} = {
    rtf: RtfDestination,
    info: InfoDestination,
    title: new MetaPropertyDestinationFactory("title"),
    subject: new MetaPropertyDestinationFactory("subject"),
    author: new MetaPropertyDestinationFactory("author"),
    manager: new MetaPropertyDestinationFactory("manager"),
    company: new MetaPropertyDestinationFactory("company"),
    operator: new MetaPropertyDestinationFactory("operator"),
    category: new MetaPropertyDestinationFactory("category"),
    keywords: new MetaPropertyDestinationFactory("keywords"),
    doccomm: new MetaPropertyDestinationFactory("doccomm"),
    hlinkbase: new MetaPropertyDestinationFactory("hlinkbase"),
    generator: new GenericPropertyDestinationFactory("rtf", "generator"),
    creatim: new MetaPropertyTimeDestinationFactory("creatim"),
    revtim: new MetaPropertyTimeDestinationFactory("revtim"),
    printim: new MetaPropertyTimeDestinationFactory("printim"),
    buptim: new MetaPropertyTimeDestinationFactory("buptim"),
    fonttbl: FonttblDestination,
    falt: new GenericSubTextPropertyDestinationFactory("falt", "fonttbl:sub",
        "setAltFontName"),
    colortbl: ColortblDestination,
    stylesheet: StylesheetDestination,
    footer: new RequiredDestinationFactory("footer"),
    footerf: new RequiredDestinationFactory("footerf"),
    footerl: new RequiredDestinationFactory("footerl"),
    footerr: new RequiredDestinationFactory("footerr"),
    footnote: new RequiredDestinationFactory("footnote"),
    ftncn: new RequiredDestinationFactory("ftncn"),
    ftnsep: new RequiredDestinationFactory("ftnsep"),
    ftnsepc: new RequiredDestinationFactory("ftnsepc"),
    header: new RequiredDestinationFactory("header"),
    headerf: new RequiredDestinationFactory("headerf"),
    headerl: new RequiredDestinationFactory("headerl"),
    headerr: new RequiredDestinationFactory("headerr"),
    pict: PictDestination,
    shppict: new PictGroupDestinationFactory(false),
    nonshppict: new PictGroupDestinationFactory(true),
    private1: new RequiredDestinationFactory("private1"),
    rxe: new RequiredDestinationFactory("rxe"),
    tc: new RequiredDestinationFactory("tc"),
    txe: new RequiredDestinationFactory("txe"),
    xe: new RequiredDestinationFactory("xe"),
    field: FieldDestination,
    fldinst: FldinstDestination,
    fldrslt: FldrsltDestination,
};
