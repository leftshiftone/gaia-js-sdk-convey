# G.A.I.A. JavaScript SDK Convey

[![CircleCI branch](https://img.shields.io/circleci/project/github/leftshiftone/gaia-js-sdk-convey/master.svg?style=flat-square)](https://circleci.com/gh/leftshiftone/gaia-js-sdk-convey)
[![GitHub tag (latest SemVer)](https://img.shields.io/github/tag/leftshiftone/gaia-js-sdk-convey.svg?style=flat-square)](https://github.com/leftshiftone/gaia-js-sdk-convey/tags)





Convey ist ein Javascript Framework, mit dem man auf die in [G.A.I.A.](https://www.leftshift.one/produkt/gaia-services/) erstellte Conversational UI zugreifen und diese selbst designen kann.

Das Framework ist mit allen gängigen Browsern kompatibel. Es kann als alleinstehende Library verwendet werden oder in ein größeres Framework wie React, Angular oder Vue eingebunden werden.



## Einbindung in ein Framework-Projekt
Hierbei wird Convey in ein Projekt, das Frameworks wie React oder Angular enthält, eingebunden.

1. Hinzufügen der Dependency mit dem Terminalbefehl ``npm i gaia-js-sdk-convey``.

2. Erstellen einer Html Seite auf der die Conversational UI verwendet werden soll.

3. Einfügen der folgenden Html Struktur:


```html
<div class="lto-gaia">
<div class="lto-content"></div>
<div class="lto-suggest"></div>
<div>
<input class="lto-textbox"/>
<button class="lto-invoker"></button>
</div>
</div>
```

4. Hinzufügen des Javascript-Codes, der Convey initialisiert.

```javascript
new Gaia(new ContentCentricRenderer(), new OffSwitchListener())
  .connect('wss://DOMAIN_NAME/mqtt', 'IDENTITY_ID')
  .then(conn => {
    conn.subscribe(ChannelType.CONTEXT, (payload) => console.log(payload));
    conn.reception();
  });
```

### Prerequisites
Link zur MQTT Schnittstelle von GAIA: zB wss://gaia.local/mqtt
Identity ID: Identifier der zu verwendenden Identity

## Einbindung als Standalone Library
1. Klonen des  [Github](https://github.com/leftshiftone/gaia-js-sdk-convey) - Projekts.
2. Ausführen von ``yarn install`` und ``yarn build`` im Terminal.
3. Öffnen von index.html im Editor.
4. Anpassen vom DOMAIN_NAME und der IDENTITY_ID.
5. Öffnen der Seite im Browser.

## Styling
Es wird empfohlen, das Basisstyling ``gaia-js-sdk-convey-all`` zu verwenden, da es das Designen erleichtert und die Struktur automatisch erstellt. Gewisse Elemente, wie der Upload oder die Camera, die Html Divs als Buttons verwenden, enthalten jedoch kein Styling.

Die verwendeten CSS-Klassen können der technischen Dokumentation entnommen werden.

## Channels
Für die Kommunikation mit G.A.I.A. werden verschiedene Kanäle verwendet.

* TEXT: Über diesen Channel werden anzeigbare Elemente geschickt. Dies kann zum Beispiel Text, eine Tabelle oder ein ganzes Eingabeformular sein. Beim instanzieren von Convey ist man automatisch mit diesem Channel verbunden. Die empfangenen Textbausteine werden dadurch automatisch in das Html Div ``lto-content`` gerendert.

* CONTEXT: Ein intelligenter Prozess enthält Variablen und Daten, mit denen gearbeitet wird. Diese werden im Context gespeichert. Damit man bei einer Änderung auf diese Werte reagieren kann, subscribt man sich und erhält so bei jeder Änderung den gesamten Kontext.

* NOTIFICATION: Die Nachrichten aus diesem Channel enthalten Befehle, die im Client etwas ausführen sollen. Die Spezifikation des Befehls erfolgt im Prozess in G.A.I.A. Verwendung findet dies zum Beispiel, wenn man asynchrone Tasks wie das Laden von Videos oder das Starten von Animationen starten möchte.

* LOG: Dieser Channel hilft leichter zu verstehen bei welchem Schritt im Prozess man gerade ist oder wo ein Fehler aufgetreten ist. Es wird auch angezeigt welcher Schritt gestartet und beendet wurde, wie das betreffende Element heißt und um welchen Typ es sich handelt.


## Renderer
Der Renderer bestimmen, wie Komponenten verarbeitet und dargestellt werden. Für das grundlegende Design einer Konversation gibt es verschiedene Renderer.


### Classic Renderer
Dieser Renderer bildet eine klassiche Konversation ab und kümmert sich um das Hinzufügen der Elemente in den Html-Dom und um Scroll- und Carousel-Animationen.

### Content Centric Renderer
Dieser Renderer Renderer versucht, die Zeit, in der ein Inhalt sichtbar ist, zu maximieren, indem er den Inhalt aktualisiert, wenn möglich, oder unterbrechende Aktionen wie Absichtskaskadierung durch Überlagerung des Inhalts anzeigt.

Es empfieht sich diesen Renderer zu verwenden oder einen eigenen auf dessen Basis zu schreiben, da er alle Funktionalitäten aller renderbaren Elementen unterstützt.

## Listener
Listener bieten die Möglichkeit auf verschiedentste Events wie Disconnect, Connection-Lost oder OnError zu reagieren. Hierfür gibt es auch verschiedene Listener.
Eine genaue Beschreibung der einzelnen Methoden findet sich [hier](https://github.com/leftshiftone/gaia-js-sdk-convey/blob/master/src/lib/api/IListener.ts).
### Default Listener
Dieser dient als Basis und sollte beim Schreiben eines eigenen Listeners als Basis verwendet werden. Der selbst geschriebene Listener kann ganz einfach in der Initialisierung von Convey angegeben werden.

### OffSwitch Listener
Wenn man möchte, dass das Textfeld nur sichtbar ist, wenn im Prozess eine Texteingabe erforderlich ist, empfiehlt sich, diesen Listener zu verwenden oder darauf aufzubauen.

## Artefakte
Bei jedem Release werden verschiedene Arten des Projekts gebaut. Darunter fallen:
* Aud: Nur die Audio Elemente sind erhalten. Dies kann beim einem Voice Assistenten praktisch sein.
* Cod: Dieses enthält nur den Code Reader
* Map: Enthält auch alle Map Librarys wie Google Maps und OSM
* Vis: Fügt eine Visualisation Library hinzu die für Statistiken verwendet werden kann.
* Std: Dieses enthält alle Elemente außer denen die in den anderen Artefakten hinzugefügt wurde.
* All: Enthält alle Convey Elemente


## Development

### Release
Releases are triggered locally. Just a tag will be pushed to trigger the CI release pipeline.

#### Major
Run `yarn trigger-release:major` locally.

#### Minor
Run `yarn trigger-release:minor` locally.

#### Patch
Run `yarn trigger-release:patch` locally.


