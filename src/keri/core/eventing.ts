import {b, concat, Dict, Ident, Ilks, Serials, versify, Version, Versionage} from "./core";
import {Tholder} from "./tholder";
import {PNumber} from "./number";
import {Prefixer} from "./prefixer";
import {Serder} from "./serder";
import {MtrDex, NonTransDex} from "./matter";
import {Saider} from "./saider";
import {Siger} from "./siger";
import {Cigar} from "./cigar";
import {Counter, CtrDex} from "./counter";


function ample(n: number, f?: number, weak = true) {
    n = Math.max(0, n)  // no negatives
    let f1
    if (f == undefined) {
        f1 = Math.max(1, Math.floor(Math.max(0, n - 1) / 3))  // least floor f subject to n >= 3*f+1

        let f2 = Math.max(1, Math.ceil(Math.max(0, n - 1) / 3))  // most Math.ceil f subject to n >= 3*f+1
        if (weak) {  // try both fs to see which one has lowest m
            return Math.min(n, Math.ceil((n + f1 + 1) / 2), Math.ceil((n + f2 + 1) / 2))
        } else {
            return Math.min(n, Math.max(0, n - f1, Math.ceil((n + f1 + 1) / 2)))
        }
    } else {
        f = Math.max(0, f)
        let m1 = Math.ceil((n + f + 1) / 2)
        let m2 = Math.max(0, n - f)
        if (m2 < m1 && n > 0) {
            throw new Error(`Invalid f=${f} is too big for n=${n}.`)
        }
        if (weak) {
            return Math.min(n, m1, m2)
        } else {
            return Math.min(n, Math.max(m1, m2))
        }
    }
}

export interface InceptArgs {
    keys: Array<string>,
    isith?: number | string | Array<string>,
    ndigs?: Array<string>,
    nsith?: number | string | Array<string>,
    toad?: number | string,
    wits?: Array<string>,
    cnfg?: Array<string>,
    data?: Array<object>,
    version?: Version,
    kind?: Serials,
    code?: string,
    intive?: boolean
    delpre?: string
}

export function incept({keys, isith, ndigs, nsith, toad, wits, cnfg, data, version=Versionage, kind=Serials.JSON, code,
                       intive = false, delpre}: InceptArgs) {


    let vs = versify(Ident.KERI, version, kind, 0)
    let ilk = delpre == undefined ? Ilks.icp : Ilks.dip
    let sner = new PNumber(0)

    if (isith == undefined) {
        isith = Math.max(1, Math.ceil(keys.length / 2))
    }

    let tholder = new Tholder(isith)
    if (tholder.num != undefined && tholder.num < 1) {
        throw new Error(`Invalid sith = ${tholder.num} less than 1.`)
    }
    if (tholder.size > keys.length) {
        throw new Error(`Invalid sith = ${tholder.num} for keys ${keys}`)
    }

    if (ndigs == undefined) {
        ndigs = new Array<string>()
    }

    if (nsith == undefined) {
        nsith = Math.max(0, Math.ceil(ndigs.length / 2))
    }

    let ntholder = new Tholder(nsith)
    if (ntholder.num != undefined && ntholder.num < 0) {
        throw new Error(`Invalid nsith = ${ntholder.num} less than 0.`)
    }
    if (ntholder.size > keys.length) {
        throw new Error(`Invalid nsith = ${ntholder.num} for keys ${ndigs}`)
    }

    wits = wits == undefined ? [] : wits
    if (new Set(wits).size != wits.length) {
        throw new Error(`Invalid wits = ${wits}, has duplicates.`)
    }

    if (toad == undefined) {
        if (wits.length == 0) {
            toad = 0
        } else {
            toad = ample(wits.length)
        }
    }

    let toader = new PNumber(toad)
    if (wits.length > 0) {
        if (toader.num < 1 || toader.num > wits.length) {
            throw new Error(`Invalid toad = ${toader.num} for wits = ${wits}`)
        }
    } else {
        if (toader.num != 0) {
            throw new Error(`Invalid toad = ${toader.num} for wits = ${wits}`)
        }
    }

    cnfg = cnfg == undefined ? new Array<string>() : cnfg
    data = data == undefined ? new Array<object>() : data

    let ked = {
        v: vs,
        t: ilk,
        d: "",
        i: "",
        s: sner.numh,
        kt: (intive && tholder.num != undefined) ? tholder.num : tholder.sith,
        k: keys,
        nt: (intive && tholder.num != undefined) ? ntholder.num: ntholder.sith,
        n: ndigs,
        bt: intive ? toader.num : toader.numh,
        b: wits,
        c: cnfg,
        a: data
    } as Dict<any>

    if (delpre != undefined) {
        ked["di"] = delpre
        if (code == undefined) {
            code = MtrDex.Blake3_256
        }
    }

    let prefixer
    if (delpre == undefined && code == undefined && keys.length == 1) {
        prefixer = new Prefixer({qb64: keys[0]})
        if (prefixer.digestive) {
            throw new Error(`Invalid code, digestive=${prefixer.code}, must be derived from ked.`)
        }
    } else {
        prefixer = new Prefixer({code: code}, ked)
        if (delpre != undefined) {
            if(!prefixer.digestive) {
                throw new Error(`Invalid derivation code = ${prefixer.code} for delegation. Must be digestive`)
            }
        }
    }

    ked["i"] = prefixer.qb64
    if (prefixer.digestive) {
        ked["d"] = prefixer.qb64
    }
    else {
        [, ked] = Saider.saidify(ked)
    }

    return new Serder(ked)
}

export function messagize(serder: Serder, sigers?: Array<Siger>, seal?: any, wigers?:Array<Cigar>, cigars?:Array<Cigar>,
                          pipelined:boolean = false): Uint8Array {
    let msg = new Uint8Array(b(serder.raw))
    let atc = new Uint8Array()

    if (sigers == undefined && wigers == undefined && cigars == undefined) {
        throw new Error(`Missing attached signatures on message = ${serder.ked}.`)
    }

    if (sigers != undefined) {
        if (seal != undefined) {
            throw new Error(`Index sig group seals not yet supported`)
        }

        atc = concat(atc, new Counter({code: CtrDex.ControllerIdxSigs, count: sigers.length}).qb64b)
        sigers.forEach((siger) => {
            atc = concat(atc, siger.qb64b)
        })
    }

    if (wigers != undefined) {
        atc = concat(atc, new Counter({code: CtrDex.ControllerIdxSigs, count: wigers.length}).qb64b)

        wigers.forEach((wiger) => {
            if (wiger.verfer && !(wiger.verfer.code in NonTransDex)) {
                throw new Error(`Attempt to use tranferable prefix=${wiger.verfer.qb64} for receipt.`)
            }
            atc = concat(atc, wiger.qb64b)
        })
    }

    if (cigars != undefined) {
        atc = concat(atc, new Counter({code: CtrDex.ControllerIdxSigs, count: cigars.length}).qb64b)

        cigars.forEach((cigar) => {
            if (cigar.verfer && !(cigar.verfer.code in NonTransDex)) {
                throw new Error(`Attempt to use tranferable prefix=${cigar.verfer.qb64} for receipt.`)
            }
            atc = concat(atc, cigar.qb64b)
        })
    }

    if (pipelined) {
        if (atc.length % 4 != 0) {
            throw new Error(`Invalid attachments size=${atc.length}, nonintegral quadlets.`)
        }
        msg = concat(msg, new Counter({code: CtrDex.AttachedMaterialQuadlets, count: (Math.floor(atc.length / 4))}).qb64b)
    }
    msg = concat(msg, atc)

    return msg
}