#!/bin/bash
# Script para instalar y arrancar el backend
echo "🦷 Instalando dependencias del backend..."
cd "$(dirname "$0")/../backend"
npm install
echo "✅ Dependencias instaladas"
echo ""
echo "🗄️  Inicializando base de datos..."
echo "⚠️  Asegúrate de configurar el archivo .env con tus credenciales MySQL"
echo ""
echo "Para inicializar la BD:"
echo "  npm run db:init"
echo ""
echo "Para iniciar el servidor:"
echo "  npm run dev"
