# G.A.I.A. JavaScript SDK Convey

[![CircleCI branch](https://img.shields.io/circleci/project/github/leftshiftone/gaia-js-sdk-convey/master.svg?style=flat-square)](https://circleci.com/gh/leftshiftone/gaia-js-sdk-convey)
[![GitHub tag (latest SemVer)](https://img.shields.io/github/tag/leftshiftone/gaia-js-sdk-convey.svg?style=flat-square)](https://github.com/leftshiftone/gaia-js-sdk-convey/tags)





Convey ist ein Javascript Framework, mit dem man auf die in FREYA erstellte Conversational UI zugreifen und diese selbst designen kann.

Das Framework ist mit allen gängigen Browsern und Internet Explorer 11 kompatibel. Es kann als alleinstehende Library verwendet werden oder in ein größeres Framework wie React, Angular oder Vue eingebunden werden.


Die technische Dokumentation der Klassen findet man auf [Github](https://github.com/leftshiftone/gaia-js-sdk-convey).


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

### Zugangsdaten
DOMAIN_NAME: Es ist der Domainname der Website von FREYA auf Ihrer Instanz.

IDENTITY_ID: Erhält man durch einen Klick auf den Fingerabdruck in der Identity-Liste in FREYA.

## Einbindung als Standalone Library
1. Klonen des  [Github](https://github.com/leftshiftone/gaia-js-sdk-convey) - Projekts.
2. Ausführen von ``yarn install`` und ``yarn build`` im Terminal.
3. Öffnen von index.html im Editor.
4. Anpassen vom DOMAIN_NAME und der IDENTITY_ID.
5. Öffnen der Seite im Browser.

## Identity ID
Die Identity ID ist die Projekt ID, die Convey angibt mit welchem Projekt es sich verbinden soll. Sie findet sich in der Liste mit allen Projekten im oberen Bereich von FREYA. Klicken wir in dieser Liste auf den Fingerabdruck, kopieren wir die Identity ID in den Zwischenspeicher.

## Styling
Es wird empfohlen, das Basisstyling ``gaia-js-sdk-convey-all`` zu verwenden, da es das Designen erleichtert und die Struktur automatisch erstellt. Gewisse Elemente, wie der Upload oder die Camera, die Html Divs als Buttons verwenden, enthalten jedoch kein Styling.

Die verwendeten CSS-Klassen können der technischen Dokumentation entnommen werden.

## Channels
Für die Kommunikation mit G.A.I.A. werden verschiedene Kanäle verwendet.

* TEXT: Über diesen Channel werden anzeigbare Elemente geschickt. Dies kann zum Beispiel Text, eine Tabelle oder ein ganzes Eingabeformular sein. Beim instanzieren von Convey ist man automatisch mit diesem Channel verbunden. Die empfangenen Textbausteine werden dadurch automatisch in das Html Div ``lto-content`` gerendert.

* CONTEXT: Ein intelligenter Prozess enthält Variablen und Daten, mit denen gearbeitet wird. Diese werden im Context gespeichert. Damit man bei einer Änderung auf diese Werte reagieren kann, subscribt man sich und erhält so bei jeder Änderung den gesamten Kontext.

* NOTIFICATION: Die Nachrichten aus diesem Channel enthalten Befehle, die im Client etwas ausführen sollen. Die Spezifikation des Befehls erfolgt im Prozess in G.A.I.A. Verwendung findet dies zum Beispiel, wenn man asynchrone Tasks wie das Laden von Videos oder das Starten von Animationen starten möchte.

* LOGS: Dieser Channel hilft leichter zu verstehen bei welchem Schritt im Prozess man gerade ist oder wo ein Fehler aufgetreten ist. Es wird auch angezeigt welcher Schritt gestartet und beendet wurde, wie das betreffende Element heißt und um welchen Typ es sich handelt.

### Beispiel subscriben auf einen Channel
Beim Initialisieren kann man die Channels angeben, auf die man sich subscriben will.

Nachfolgend wird auf die Channels TEXT und CONTEXT subscribt.

```javascript
new Gaia(new ContentCentricRenderer(), new OffSwitchListener())
  .connect('wss://DOMAIN_NAME/mqtt', 'IDENTITY_ID')
  .then(conn => {
    conn.subscribe(ChannelType.TEXT, (payload) => console.log(payload));
    conn.subscribe(ChannelType.CONTEXT, (payload) => console.log(payload));
    conn.reception();
  });
```

## Renderer
Für das grundlegende Design eines Convey Clients gibt es verschiedene Renderer.

### Abstract Renderer
Dieser stellt die Basis für jeden Renderer dar. Er kümmert sich um das Hinzufügen der Elemente in den Html-Dom.

Möchte man einen eigenen Renderer schreiben, reicht es, von diesem Renderer abzuleiten und den neuen Renderer in der Initialisierung von Convey anzugeben.

### Classic Renderer
Dieser Renderer erbt alle Eigenschaften vom Abstract Renderer und erweitert diese um Scroll- und Carousel-Animationen.

### Content Centric Renderer
Dieser Renderer erbt vom Classic Renderer und erweitert dessen Funktionalitäten um Suggestions und Overlays.

Es empfieht sich diesen Renderer zu verwenden oder einen eigenen auf dessen Basis zu schreiben, da er alle Funktionalitäten aller renderbaren Elementen unterstützt.

## Listener
Listener bieten die Möglichkeit auf verschiedentste Events wie Disconnect, Connection-Lost oder OnError zu reagieren. Hierfür gibt es auch verschiedene Listener.

### Default Listener
Dieser dient als Basis und sollte beim Schreiben eines eigenen Listeners als Basis verwendet werden. Der selbst geschriebene Listener kann ganz einfach in der Initialisierung von Convey angegeben werden.

### OffSwitch Listener
Wenn man möchte, dass das Textfeld nur sichtbar ist, wenn im Prozess eine Texteingabe erforderlich ist, empfiehlt sich, diesen Listener zu verwenden oder darauf aufzubauen.








