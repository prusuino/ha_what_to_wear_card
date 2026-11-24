# Security Policy

## Supported Versions

Only the latest release is supported.

## Reporting a Vulnerability

The card runs in your browser and makes no requests of its own: it reads the weather entity you choose, its forecast and `sun.sun` from your Home Assistant, and nothing leaves it. It loads no fonts, images or scripts from elsewhere; everything is drawn in the card. Texts from the configuration and from Home Assistant are escaped before they are shown.

If you believe you have found a security issue, please report it privately via [GitHub Security Advisories](../../security/advisories/new).
