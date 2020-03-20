/**
 * Niki, der Roboter
 * Thorsten Kimmeskamp, 20.03.2020
 */
//% weight=100 color=#0fbc11 icon="\uf14e"
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

    let x = 0 // Nikis x-Position auf dem Spielfeld
    let y = 0 // Nikis y-Position auf dem Spielfeld
    let richtung = 0 // Richtung, in die Niki gerade guckt
    let vorrat = 0 // Nikis aktueller Vorrat an Schrauben
    let verzoegerung = 0 // Millisekunden, die zwischen jeder von Nikis Aktionen vergehen sollen
    let eingeschaltet = false // ist Niki eingeschaltet?
    let fehler = false // ist ein Fehler eingetreten?

    let spielfeld: number[][] = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]


    /**
     * Handsteuerung: gehe vor, wenn Taste A gedrückt
     */
    input.onButtonPressed(Button.A, () => {
        geheVor()
    })

    /**
     * Handsteuerung: drehe links, wenn Taste B gedrückt
     */
    input.onButtonPressed(Button.B, () => {
        dreheLinks()
    })

    /**
     * Handsteuerung: wenn Taste A+B gedrückt: nimm auf, falls Platz belegt, sonst lege ab
     */
    input.onButtonPressed(Button.AB, () => {
        if (platzBelegt()) {
            nimmAuf()
        } else {
            legeAb()
        }
    })
	

    /**
     * Erstelle ein leeres Spielfeld. Niki darf nicht eingeschaltet sein.
     */
    //% blockId=erstelleSpielfeldLeer block="erstelle leeres Spielfeld"
    export function erstelleSpielfeldLeer() {
        if (!eingeschaltet) {
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    spielfeld[0][0] = 0
                }
            }
            basic.clearScreen()
        } else {
            fehler = true
            basic.showIcon(IconNames.Sad)
        }
    }

    /**
     * Erstelle ein Spielfeld und setze die im String angegebene Zahl von Schrauben (0..9) auf die einzelnen Felder (Beginnend oben links). Beispiel: "1000011000111001111011111". Niki darf nicht eingeschaltet sein.
     */
    //% blockId=erstelleSpielfeld block="erstelle Spielfeld %s"
    export function erstelleSpielfeld(s: string) {
        if (!eingeschaltet) {
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    let n = parseInt(s.charAt(i + 5 * j))
                    if (n >= 0) {
                        spielfeld[i][j] = n
                    }
                }
            }

            basic.clearScreen()
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    if (spielfeld[i][j] > 0) {
                        led.plot(i, j)
                    }
                }
            }
        } else {
            fehler = true
            basic.showIcon(IconNames.Sad)
        }
    }

    /**
     * Erstelle ein Spielfeld mit einer zufälliger Verteilung. Etwa ein Fünftel der Felder wird mit einer Schraube belegt. Niki darf nicht eingeschaltet sein.
     */
    //% blockId=erstelleSpielfeldZufall block="erstelle zufälliges Spielfeld"
    export function erstelleSpielfeldZufall() {
        if (!eingeschaltet) {
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    if (Math.random(5) == 0) {
                        spielfeld[i][j] = 1
                    } else {
                        spielfeld[i][j] = 0
                    }
                }
            }

            basic.clearScreen()
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    if (spielfeld[i][j] > 0) {
                        led.plot(i, j)
                    }
                }
            }
        } else {
            fehler = true
            basic.showIcon(IconNames.Sad)
        }
    }

    /**
     * Setze Niki auf die Koordinaten x = 4, y = 4 mit Blick nach Norden. Niki darf nicht bereits eingeschaltet sein.
     */
    //% blockId=einschalten block="schalte ein"
    export function einschalten(): void {
        if (!eingeschaltet) {
            x = 4;
            y = 4;
            richtung = 0;
            led.plot(x, y)
            eingeschaltet = true
            fehler = false
        } else {
            fehler = true
            basic.showIcon(IconNames.Sad)
        }
    }

    /**
     * Setze Niki auf die angegebenen Koordinaten mit Blick in die angegebene Richtung. Niki darf nicht bereits eingeschaltet sein.
     */
    //% blockId=einschaltenPosition block="schalte ein mit x = %x| , y = %y| und Blick nach %richtung"
    export function einschaltenPosition(x_neu: number, y_neu: number, richtung_neu: himmelsrichtungen): void {
        if (!eingeschaltet) {
            fehler = false
            if (x_neu >= 0 && x_neu < 5) {
                x = x_neu
            } else {
                fehler = true
            }
            if (y_neu >= 0 && y_neu < 5) {
                y = y_neu
            } else {
                fehler = true
            }
            if (richtung_neu >= 0 && richtung_neu < 4) {
                richtung = richtung_neu
            } else {
                fehler = true
            }

            if (!fehler) {
                led.plot(x, y)
                eingeschaltet = true
            } else {
                basic.showIcon(IconNames.Sad)
            }
        } else {
            fehler = true
            basic.showIcon(IconNames.Sad)
        }
    }
	
	/**
    * Setzt Niki auf zufällige Koordinaten mit Blick in eine zufällige Richtung.
    */
    //% blockId=einschaltenZufall block="schalte ein zufällig"
    export function einschaltenZufall(): void {
        if (!eingeschaltet) {
            x = Math.random(5)
            y = Math.random(5)
            richtung = Math.random(4)
            led.plot(x, y)
            eingeschaltet = true
			fehler = false
        } else {
			fehler = true
            basic.showIcon(IconNames.Sad)
		}
    }

    /**
     * Gehe in der aktuellen Richtung ein Feld vor. Niki muss eingeschaltet sein und darf nicht vor eine Wand laufen.
     */
    //% blockId=geheVor block="gehe vor"
    export function geheVor(): void {
        if (eingeschaltet) {
            basic.pause(verzoegerung)

            if (spielfeld[x][y] == 0) {
                led.unplot(x, y)
            }

            if (richtung == 0 && y > 0) {
                y -= 1
            } else if (richtung == 1 && x < 4) {
                x += 1
            } else if (richtung == 2 && y < 4) {
                y += 1
            } else if (richtung == 3 && x > 0) {
                x -= 1
            } else {
                fehler = true
            }

            if (!fehler) {
                led.plot(x, y)
            } else {
                basic.showIcon(IconNames.Sad)
                ausschalten()
            }

        } else {
            basic.showIcon(IconNames.Sad)
        }
    }

    /**
     * Drehe dich um 90° nach links. Niki muss eingeschaltet sein.
     */
    //% blockId=dreheLinks block="drehe links"
    export function dreheLinks(): void {
        if (eingeschaltet) {
            basic.pause(verzoegerung)
            if (richtung > 0) {
                richtung -= 1
            } else {
                richtung = 3
            }
        } else {
            fehler = true
            basic.showIcon(IconNames.Sad)
        }
    }

	/**
     * Liefert "true", falls Niki nicht unmittelbar vor dem Bildschirmrand steht (in der aktuellen Richtung). Niki muss eingeschaltet sein.
     */
    //% blockId=vorneFrei block="vorne frei"
    export function vorneFrei(): boolean {
        if (eingeschaltet) {
            if (richtung == 0 && y > 0) {
                return true
            } else if (richtung == 1 && x < 4) {
                return true
            } else if (richtung == 2 && y < 4) {
                return true
            } else if (richtung == 3 && x > 0) {
                return true
            } else {
                return false
            }
        } else {
            fehler = true
            basic.showIcon(IconNames.Sad)
            return false
        }
    }

    /**
     * Liefert "true", wenn Niki nach Norden blickt. Niki muss eingeschaltet sein.
     */
    //% blockId=nordwaerts block="nordwärts"
    export function nordwaerts(): boolean {
        if (eingeschaltet) {
            return (richtung == 0)
        } else {
            fehler = true
            basic.showIcon(IconNames.Sad)
            return false
        }
    }

    /**
     * Liefert "true", wenn Niki nach Osten blickt. Niki muss eingeschaltet sein.
     */
    //% blockId=ostwaerts block="ostwärts"
    export function ostwaerts(): boolean {
        if (eingeschaltet) {
            return (richtung == 1)
        } else {
            fehler = true
            basic.showIcon(IconNames.Sad)
            return false
        }
    }

    /**
     * Liefert "true", wenn Niki nach Süden blickt. Niki muss eingeschaltet sein.
     */
    //% blockId=suedwaerts block="südwärts"
    export function suedwaerts(): boolean {
        if (eingeschaltet) {
            return (richtung == 2)
        } else {
            fehler = true
            basic.showIcon(IconNames.Sad)
            return false
        }
    }

    /**
     * Liefert "true", wenn Niki nach Westen blickt. Niki muss eingeschaltet sein.
     */
    //% blockId=westwaerts block="westwärts"
    export function westwaerts(): boolean {
        if (eingeschaltet) {
            return (richtung == 3)
        } else {
            fehler = true
            basic.showIcon(IconNames.Sad)
            return false
        }
    }

    /**
     * Nimm eine Schraube von der aktuellen Position auf. Bei mehreren Schrauben auf der Position wird nur eine aufgehoben. Niki darf nichts von einem leeren Feld aufheben und muss eingeschaltet sein.
     */
    //% blockId=nimmAuf block="nimm auf"
    export function nimmAuf(): void {
        if (eingeschaltet) {
            basic.pause(verzoegerung)
            if (spielfeld[x][y] > 0) {
                vorrat++
                spielfeld[x][y]--
            } else {
                fehler = true
                basic.showIcon(IconNames.Sad)
                ausschalten()
            }
        } else {
            basic.showIcon(IconNames.Sad)
        }
    }

    /** 
     * Lege eine Schraube auf die aktuelle Position. Nikis Vorrat muss größer als 0 sein und Niki muss eingeschaltet sein.
     */
	//% blockId=legeAb block="lege ab"
    export function legeAb(): void {
        if (eingeschaltet) {
            basic.pause(verzoegerung)
            if (vorrat > 0) {
                spielfeld[x][y]++
                vorrat--
            } else {
                fehler = true
                basic.showIcon(IconNames.Sad)
                ausschalten()
            }
        } else {
            basic.showIcon(IconNames.Sad)
        }
    }


    /**
     * Liefert "true", wenn sich an Nikis aktueller Position eine Schraube befindet. Niki muss eingeschaltet sein.
     */
    //% blockId=platzBelegt block="Platz belegt"
    export function platzBelegt(): boolean {
        if (eingeschaltet) {
            return (spielfeld[x][y] > 0)
        } else {
            fehler = true
            basic.showIcon(IconNames.Sad)
            return false
        }
    }

    /**
     * Liefert "true", wenn Nikis Vorrat größer als 0 ist. Niki muss eingeschaltet sein.
     */
    //% blockId=hatVorrat block="hat Vorrat"
    export function hatVorrat(): boolean {
        if (eingeschaltet) {
            return (vorrat > 0)
        } else {
            fehler = true
            basic.showIcon(IconNames.Sad)
            return false
        }
    }

    /**
     * Setze eine Verzögerung von n Millisekunden nach jeder Aktion.
     */
    //% blockId=setzeVerzoegerung block="setze Verzögerung %verzoegerung_neu"
    export function setzeVerzoegerung(verzoegerung_neu: number): void {
        if (verzoegerung_neu >= 0) {
            verzoegerung = verzoegerung_neu
        }
    }

    /**
     * Schalte Niki aus. Niki muss eingeschaltet sein.
     */
    //% blockId=ausschalten block="schalte aus"
    export function ausschalten(): void {
        if (eingeschaltet) {
            if (spielfeld[x][y] == 0) {
                led.unplot(x, y)
            }
            eingeschaltet = false;
        } else {
            fehler = true
            basic.showIcon(IconNames.Sad)
        }
    }
}