#!/usr/bin/env bash
#
# Genera una app o lib nueva a partir de las plantillas de templates/.
#
# Uso:
#   scripts/create-package.sh app <nombre> "<descripcion>"
#   scripts/create-package.sh lib <nombre>
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMPLATES_DIR="$ROOT_DIR/templates"

TYPE="${1:-}"
NAME="${2:-}"
DESCRIPTION="${3:-}"

if [[ -z "$TYPE" || -z "$NAME" ]]; then
	echo "Uso: scripts/create-package.sh <app|lib> <nombre> [descripcion]" >&2
	exit 1
fi

case "$TYPE" in
	app) DEST="$ROOT_DIR/packages/apps/$NAME" ;;
	lib) DEST="$ROOT_DIR/packages/libs/$NAME" ;;
	*) echo "Tipo invalido: $TYPE (usa 'app' o 'lib')" >&2; exit 1 ;;
esac

if [[ -e "$DEST" ]]; then
	echo "Ya existe: $DEST" >&2
	exit 1
fi

mkdir -p "$DEST/src"

if [[ "$TYPE" == "app" ]]; then
	sed -e "s/\[APP_NAME\]/$NAME/g" \
		-e "s/\[APP_DESCRIPTION\]/${DESCRIPTION:-$NAME app}/g" \
		"$TEMPLATES_DIR/package.app.template.json" > "$DEST/package.json"
	cp "$TEMPLATES_DIR/tsconfig.app.template.json" "$DEST/tsconfig.json"
	cat > "$DEST/src/main.ts" <<'EOF'
export function main(): void {
	console.log('hello from app');
}

main();
EOF
else
	sed -e "s/\[LIB_NAME\]/$NAME/g" \
		"$TEMPLATES_DIR/package.lib.template.json" > "$DEST/package.json"
	cp "$TEMPLATES_DIR/tsconfig.lib.template.json" "$DEST/tsconfig.json"
	cat > "$DEST/src/index.ts" <<'EOF'
export const hello = (): string => 'hello from lib';
EOF
fi

echo "Creado $TYPE '@template/$NAME' en $DEST"
echo "Recuerda correr: bun install"
