/**
 * Niki, der Roboter
 */
//% weight=100 color=#0fbc11

namespace niki {

    export enum himmelsrichtungen {
        //% block="Norden"
        norden = 0,
        //% block="Osten"
        osten = 1,
        //% block="Süden"
        sueden = 2,
        //% block="Westen"
        westen = 3,
    }

    let y = 0
    let x = 0
    let richtung = 0
    let vorrat = 0
    let geschwindigkeit = 0
    let eingeschaltet = false

    let spielfeld: number[][] = [[0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]]

    /**
    * Erstelle Nikis Spielfeld und setze die im String angegebene Zahl von Token (0..9) auf die einzelnen Felder (Beginnend oben links). Beispiel: "1000011000111001111011111"
    */
    //% block
    export function erstelleSpielfeld(s: string) {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                let n = parseInt(s.charAt(i + 5 * j))
                if (n >= 0) {
                    spielfeld[i][j] = n
                }
            }
        }

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (spielfeld[i][j] > 0) {
                    led.plot(i, j)
                }
            }
        }
    }

    /**
    * Erstelle ein Spielfeld mit einer zufälliger Verteilung von Token für Niki.
    */
    //% block
    export function erstelleSpielfeldZufall() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (Math.random(5) == 0) {
                    spielfeld[i][j] = 1
                } else {
                    spielfeld[i][j] = 0
                }
            }
        }

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (spielfeld[i][j] > 0) {
                    led.plot(i, j)
                }
            }
        }
    }

    /**
    * Setzt Niki auf die Koordinaten 0,0 mit Blick nach Norden.
    */
    //% block
    export function einschalten(): void {
        if (!eingeschaltet) {
            x = 0;
            y = 0;
            richtung = 0;
            led.plot(x, y)
            eingeschaltet = true
        }
    }

    /**
    * Setzt Niki auf zufällige Koordinaten mit Blick in eine zufällige Richtung.
    */
    //% block
    export function einschaltenZufall(): void {
        if (!eingeschaltet) {
            x = Math.random(5)
            y = Math.random(5)
            richtung = Math.random(5)
            led.plot(x, y)
            eingeschaltet = true
        }
    }

    /**
    * Setzt Niki auf die angegebenen Koordinaten mit Blick in die angegebene Richtung.
    */
    //% block
    export function einschaltenPosition(x: number, y: number, richtung: himmelsrichtungen): void {
        if (!eingeschaltet) {
            if (x >= 0 && x < 5) {
                x = x
            }
            if (y >= 0 && y < 5) {
                y = y
            }
            if (richtung >= 0 && richtung < 4) {
                richtung = richtung
            }
            led.plot(x, y)

            eingeschaltet = true
        }
    }

    /**
    * Gehe, soweit möglich, ein Feld in die aktuelle Richtung.
    */
    //% block
    export function geheVor(): void {
        if (eingeschaltet) {
            basic.pause(geschwindigkeit)

            if (spielfeld[x][y] == 0) {
                led.unplot(x, y)
            }

            if (richtung == 0 && y > 0) {
                y += -1
            } else if (richtung == 1 && x > 0) {
                x += -1
            } else if (richtung == 2 && y < 4) {
                y += 1
            } else if (richtung == 3 && x < 4) {
                x += 1
            }

            led.plot(x, y)
        } else {
            basic.showIcon(IconNames.Sad)
        }
    }

    /**
    * Drehe dich um 90° nach links.
    */
    //% block
    export function dreheLinks(): void {
        if (eingeschaltet) {
            basic.pause(geschwindigkeit)
            if (richtung < 3) {
                richtung += 1
            } else {
                richtung = 0
            }
        } else {
            basic.showIcon(IconNames.Sad)
        }
    }

    /**
    * Liefere "true", falls Niki nicht unmittelbar vor dem Bildschirmrand steht (in der aktuellen Richtung).
    */
    //% block
    export function vorneFrei(): boolean {
        if (richtung == 0 && y > 0) {
            return true
        } else if (richtung == 1 && x > 0) {
            return true
        } else if (richtung == 2 && y < 4) {
            return true
        } else if (richtung == 3 && x < 4) {
            return true
        } else {
            return false
        }
    }

    /**
    * Liefere "true", falls links von Niki nicht unmittelbar der Bildschirmrand ist.
    */
    //% block
    export function linksFrei(): boolean {
        if (richtung == 0 && x > 0) {
            return true
        } else if (richtung == 1 && y < 4) {
            return true
        } else if (richtung == 2 && x < 4) {
            return true
        } else if (richtung == 3 && y > 0) {
            return true
        } else {
            return false
        }
    }

    /**
    * Liefere "true", falls rechts von Niki nicht unmittelbar der Bildschirmrand ist.
    */
    //% block
    export function rechtsFrei(): boolean {
        if (richtung == 0 && x < 4) {
            return true
        } else if (richtung == 1 && y > 0) {
            return true
        } else if (richtung == 2 && x > 0) {
            return true
        } else if (richtung == 3 && y < 4) {
            return true
        } else {
            return false
        }
    }

    /**
    * Liefert "true", wenn Niki nach Norden blickt.
    */
    //% block
    export function nordwaerts(): boolean {
        return (richtung == 0)
    }

    /**
    * Liefert "true", wenn Niki nach Westen blickt.
    */
    //% block
    export function westwaerts(): boolean {
        return (richtung == 1)
    }

    /**
    * Liefert "true", wenn Niki nach Süden blickt.
    */
    //% block
    export function suedwaerts(): boolean {
        return (richtung == 2)
    }

    /**
    * Liefert "true", wenn Niki nach Osten blickt.
    */
    //% block
    export function ostwaerts(): boolean {
        return (richtung == 3)
    }

    /**
     * Nimm ein Token von der aktuellen Position auf (sofern dort eines liegt). Bei mehreren Token auf der Position wird nur eines aufgehoben.
     */
    //% block
    export function nimmAuf(): void {
        if (eingeschaltet) {
            basic.pause(geschwindigkeit)
            if (spielfeld[x][y] > 0) {
                vorrat++
                spielfeld[x][y]--
            }
        } else {
            basic.showIcon(IconNames.Sad)
        }
    }

    /** 
     * Lege ein Token auf die aktuelle Position, sofern Nikis Vorrat größer als 0 ist.
     */
    //% block
    export function legeAb(): void {
        if (eingeschaltet) {
            basic.pause(geschwindigkeit)
            if (vorrat > 0) {
                spielfeld[x][y]++
                vorrat--
            }
        } else {
            basic.showIcon(IconNames.Sad)
        }
    }

    /**
    * Liefert "true", wenn sich an Nikis aktueller Position ein Token befindet.
    */
    //% block
    export function platzBelegt(): boolean {
        return (spielfeld[x][y] > 0)
    }

    /**
     * Liefert "true", wenn Niki mindestens ein Token aufgenommen (und nicht wieder abgelegt) hat.
     */
    //% block
    export function hatVorrat(): boolean {
        return (vorrat > 0)
    }

    /**
     * Setzt ein Delay von n Millisekunden nach jeder Aktion.
     */
    //% block
    export function setzeGeschwindigkeit(n: number): void {
        geschwindigkeit = n
    }

    /**
    * Schaltet Niki aus.
    */
    //% block
    export function ausschalten(): void {
        if (eingeschaltet) {
            if (spielfeld[x][y] == 0) {
                led.unplot(x, y)
            }
            eingeschaltet = false;
        }
    }
} 