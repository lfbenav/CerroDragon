#!/bin/bash

# ============================================
# CERRO DRAGÓN API - TEST SCRIPT
# ============================================
# Token de admin (actualizar si expira)
# Para obtener nuevo token: curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"admin","password":"admin"}'
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MTNjMTUzZi0wMmI2LTQ0MzEtYmExOS1jN2FmNTBmNjEzNzkiLCJ0eXBlIjoiYWRtaW4iLCJpYXQiOjE3Njg2MDM4OTQsImV4cCI6MTc2ODYwNzQ5NH0.5rhUvJDBbsTos_CWLtOfguzQWIzG0ylG2v_Xg8bPkZg"

BASE_URL="http://localhost:3000"

# ============================================
# CONFIGURACIÓN - ACTUALIZA ESTOS VALORES
# ============================================
# Obtén estos IDs de tu base de datos:
# SELECT id FROM customers LIMIT 1;
# SELECT id FROM guides LIMIT 1;
CUSTOMER_ID="1bed1352-a109-4262-ac58-2e8b062edc7d"
GUIDE_ID="7cac20b1-32b7-4e57-92ee-4d464609a399"  # "8dd9faf4-5ffe-4c20-8d86-916428ff7e58"

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}    CERRO DRAGÓN API - TESTS${NC}"
echo -e "${BLUE}============================================${NC}"

# ============================================
# TOURS - Tabla: tours
# ============================================
echo -e "\n${YELLOW}========== TOURS (tabla: tours) ==========${NC}"

echo -e "\n${GREEN}1. GET /tours - Obtener todos los tours${NC}"
curl -s $BASE_URL/tours
echo ""

echo -e "\n${GREEN}2. GET /tours/allActive - Obtener tours activos${NC}"
curl -s $BASE_URL/tours/allActive
echo ""

echo -e "\n${GREEN}3. POST /tours - Crear tour (ADMIN)${NC}"
TOUR_RESPONSE=$(curl -s -X POST $BASE_URL/tours \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Tour Cerro Dragón",
    "description": "Aventura en el cerro",
    "duration_hours": 4,
    "duration_days": 1,
    "max_persons": 15,
    "base_location": "Cerro Dragón, Costa Rica"
  }')
echo $TOUR_RESPONSE
echo ""

# Extraer ID del tour creado (sin jq, usando grep/sed)
TOUR_ID=$(echo $TOUR_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"//;s/"//')
echo -e "Tour ID creado: $TOUR_ID"

echo -e "\n${GREEN}4. GET /tours/:id - Obtener tour por ID${NC}"
curl -s $BASE_URL/tours/$TOUR_ID
echo ""

echo -e "\n${GREEN}5. PUT /tours/:id - Actualizar tour (ADMIN)${NC}"
curl -s -X PUT $BASE_URL/tours/$TOUR_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Tour Cerro Dragón ACTUALIZADO",
    "max_persons": 20
  }'
echo ""

# ============================================
# TAGS - Tablas: tags, tour_tags
# ============================================
echo -e "\n${YELLOW}========== TAGS (tablas: tags, tour_tags) ==========${NC}"

echo -e "\n${GREEN}6. GET /tags - Obtener todos los tags${NC}"
curl -s $BASE_URL/tags
echo ""

# Nota: Necesitas crear tags en la BD primero
# INSERT INTO tags (name) VALUES ('Aventura'), ('Naturaleza'), ('Familiar');

echo -e "\n${GREEN}7. GET /tours/:id/tags - Obtener tags de un tour${NC}"
curl -s $BASE_URL/tours/$TOUR_ID/tags
echo ""

# Si tienes un tag_id, descomenta:
# echo -e "\n${GREEN}8. POST /tours/:id/tags - Agregar tag a tour (ADMIN)${NC}"
# curl -s -X POST $BASE_URL/tours/$TOUR_ID/tags \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer $TOKEN" \
#   -d '{"tag_id": "UUID_DEL_TAG"}'
# echo ""

# echo -e "\n${GREEN}9. DELETE /tours/:id/tags/:tag_id - Remover tag de tour (ADMIN)${NC}"
# curl -s -X DELETE $BASE_URL/tours/$TOUR_ID/tags/UUID_DEL_TAG \
#   -H "Authorization: Bearer $TOKEN"
# echo ""

# ============================================
# TOUR PACKAGES - Tabla: tour_packages
# ============================================
echo -e "\n${YELLOW}========== TOUR PACKAGES (tabla: tour_packages) ==========${NC}"

echo -e "\n${GREEN}10. GET /tour-packages - Obtener todos los paquetes${NC}"
curl -s $BASE_URL/tour-packages
echo ""

echo -e "\n${GREEN}11. POST /tour-packages - Crear paquete (ADMIN)${NC}"
PACKAGE_RESPONSE=$(curl -s -X POST $BASE_URL/tour-packages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"tour_id\": \"$TOUR_ID\",
    \"name\": \"Paquete Básico\",
    \"price_usd\": 50.00
  }")
echo $PACKAGE_RESPONSE
echo ""

PACKAGE_ID=$(echo $PACKAGE_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"//;s/"//')
echo -e "Package ID creado: $PACKAGE_ID"

echo -e "\n${GREEN}12. GET /tour-packages?tour_id= - Filtrar por tour${NC}"
curl -s "$BASE_URL/tour-packages?tour_id=$TOUR_ID"
echo ""

echo -e "\n${GREEN}13. PUT /tour-packages/:id - Actualizar paquete (ADMIN)${NC}"
curl -s -X PUT $BASE_URL/tour-packages/$PACKAGE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Paquete Básico ACTUALIZADO",
    "price_usd": 55.00
  }'
echo ""

# ============================================
# TOUR PACKAGE ITEMS - Tabla: tour_package_items
# ============================================
echo -e "\n${YELLOW}========== TOUR PACKAGE ITEMS (tabla: tour_package_items) ==========${NC}"

echo -e "\n${GREEN}14. GET /tour-package-items - Obtener todos los items${NC}"
curl -s $BASE_URL/tour-package-items
echo ""

echo -e "\n${GREEN}15. POST /tour-package-items - Crear item (ADMIN)${NC}"
ITEM_RESPONSE=$(curl -s -X POST $BASE_URL/tour-package-items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"package_id\": \"$PACKAGE_ID\",
    \"item_name\": \"Almuerzo incluido\"
  }")
echo $ITEM_RESPONSE
echo ""

ITEM_ID=$(echo $ITEM_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"//;s/"//')
echo -e "Item ID creado: $ITEM_ID"

echo -e "\n${GREEN}16. GET /tour-package-items?package_id= - Filtrar por paquete${NC}"
curl -s "$BASE_URL/tour-package-items?package_id=$PACKAGE_ID"
echo ""

# ============================================
# PROMOTIONS - Tabla: promotions
# ============================================
echo -e "\n${YELLOW}========== PROMOTIONS (tabla: promotions) ==========${NC}"

echo -e "\n${GREEN}17. GET /promotions - Obtener todas las promociones${NC}"
curl -s $BASE_URL/promotions
echo ""

echo -e "\n${GREEN}18. POST /promotions - Crear promoción (ADMIN)${NC}"
PROMO_RESPONSE=$(curl -s -X POST $BASE_URL/promotions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"tour_id\": \"$TOUR_ID\",
    \"title\": \"Descuento de Verano\",
    \"description\": \"20% de descuento en enero\",
    \"discount_value\": 10.00,
    \"starts_at\": \"2026-01-01T00:00:00Z\",
    \"ends_at\": \"2026-01-31T23:59:59Z\"
  }")
echo $PROMO_RESPONSE
echo ""

PROMO_ID=$(echo $PROMO_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"//;s/"//')
echo -e "Promotion ID creado: $PROMO_ID"

echo -e "\n${GREEN}19. GET /promotions/:id - Obtener promoción por ID${NC}"
curl -s $BASE_URL/promotions/$PROMO_ID
echo ""

echo -e "\n${GREEN}20. GET /promotions?active_only=true - Solo promociones activas${NC}"
curl -s "$BASE_URL/promotions?active_only=true"
echo ""

echo -e "\n${GREEN}21. PUT /promotions/:id - Actualizar promoción (ADMIN)${NC}"
curl -s -X PUT $BASE_URL/promotions/$PROMO_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Descuento de Verano EXTENDIDO",
    "discount_value": 15.00
  }'
echo ""

# ============================================
# RESERVATIONS - Tablas: reservations, reservation_status_history
# ============================================
echo -e "\n${YELLOW}========== RESERVATIONS (tablas: reservations, reservation_status_history) ==========${NC}"

echo -e "\n${GREEN}22. GET /reservations - Obtener todas las reservaciones (ADMIN)${NC}"
curl -s $BASE_URL/reservations \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo -e "\n${GREEN}23. POST /reservations - Crear reservación${NC}"
RESERVATION_RESPONSE=$(curl -s -X POST $BASE_URL/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"customer_id\": \"$CUSTOMER_ID\",
    \"tour_id\": \"$TOUR_ID\",
    \"promotion_id\": \"$PROMO_ID\",
    \"tour_package_id\": \"$PACKAGE_ID\",
    \"tour_date\": \"2026-02-15\",
    \"persons\": 4,
    \"can_arrive_4x4\": true,
    \"subtotal_usd\": 200.00,
    \"discount_usd\": 15.00,
    \"meeting_extra_usd\": 0,
    \"total_usd\": 185.00
  }")
echo $RESERVATION_RESPONSE
echo ""
RESERVATION_ID=$(echo $RESERVATION_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"//;s/"//')
echo -e "Reservation ID creado: $RESERVATION_ID"

echo -e "\n${GREEN}24. GET /reservations?status=PENDING - Filtrar por status${NC}"
curl -s "$BASE_URL/reservations?status=PENDING" \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo -e "\n${GREEN}25. GET /reservations?date=2026-02-15 - Filtrar por fecha${NC}"
curl -s "$BASE_URL/reservations?date=2026-02-15" \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo -e "\n${GREEN}26. GET /reservations?tour_id= - Filtrar por tour${NC}"
curl -s "$BASE_URL/reservations?tour_id=$TOUR_ID" \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo -e "\n${GREEN}27. GET /reservations/:id - Obtener reservación por ID${NC}"
curl -s $BASE_URL/reservations/$RESERVATION_ID \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo -e "\n${GREEN}28. PUT /reservations/:id/status - Cambiar status a CONFIRMED (ADMIN)${NC}"
curl -s -X PUT $BASE_URL/reservations/$RESERVATION_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "CONFIRMED"}'
echo ""

echo -e "\n${GREEN}29. GET /reservations/:id/status-history - Ver historial de status${NC}"
curl -s $BASE_URL/reservations/$RESERVATION_ID/status-history \
  -H "Authorization: Bearer $TOKEN"
echo ""

# ============================================
# MY RESERVATIONS - Para clientes
# ============================================
echo -e "\n${YELLOW}========== MY RESERVATIONS (para clientes) ==========${NC}"

echo -e "\n${GREEN}30. GET /my-reservations - Mis reservaciones${NC}"
curl -s $BASE_URL/my-reservations \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo -e "\n${GREEN}31. POST /reservations/:id/request-refund - Solicitar reembolso${NC}"
curl -s -X POST $BASE_URL/reservations/$RESERVATION_ID/request-refund \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo -e "\n${GREEN}32. GET /reservations/:id/status-history - Ver historial después del refund${NC}"
curl -s $BASE_URL/reservations/$RESERVATION_ID/status-history \
  -H "Authorization: Bearer $TOKEN"
echo ""

# ============================================
# GUIDE ASSIGNMENT - Tablas: reservation_guides, guides
# ============================================
echo -e "\n${YELLOW}========== GUIDE ASSIGNMENT (tablas: reservation_guides, guides) ==========${NC}"

echo -e "\n${GREEN}33. GET /assign-guide - Ver asignaciones de guías (ADMIN)${NC}"
curl -s $BASE_URL/assign-guide \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo -e "\n${GREEN}34. POST /assign-guide/:reservation_id/:guide_id - Asignar guía (ADMIN)${NC}"
curl -s -X POST $BASE_URL/assign-guide/$RESERVATION_ID/$GUIDE_ID \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo -e "\n${GREEN}35. GET /assign-guide?reservation_id= - Ver asignación específica${NC}"
curl -s "$BASE_URL/assign-guide?reservation_id=$RESERVATION_ID" \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo -e "\n${GREEN}36. DELETE /assign-guide/:reservation_id/:guide_id - Remover guía (ADMIN)${NC}"
curl -s -X DELETE $BASE_URL/assign-guide/$RESERVATION_ID/$GUIDE_ID \
  -H "Authorization: Bearer $TOKEN"
echo ""

# ============================================
# DOCUMENTS - Tabla: reservation_documents
# ============================================
echo -e "\n${YELLOW}========== DOCUMENTS (tabla: reservation_documents) ==========${NC}"

echo -e "\n${GREEN}37. GET /reservations/:id/documents - Ver documentos de reservación${NC}"
curl -s $BASE_URL/reservations/$RESERVATION_ID/documents \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo -e "\n${GREEN}38. POST /reservations/:id/documents - Agregar documento RECEIPT (ADMIN)${NC}"
DOC_RESPONSE=$(curl -s -X POST $BASE_URL/reservations/$RESERVATION_ID/documents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "doc_type": "RECEIPT",
    "file_url": "https://storage.cerrodragon.com/receipts/12345.pdf"
  }')
echo $DOC_RESPONSE
echo ""
DOC_ID=$(echo $DOC_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"//;s/"//')
echo -e "Document ID creado: $DOC_ID"

echo -e "\n${GREEN}39. GET /documents/:id - Obtener documento por ID${NC}"
curl -s $BASE_URL/documents/$DOC_ID \
  -H "Authorization: Bearer $TOKEN"
echo ""

# ============================================
# CLEANUP (opcional) - Descomentar para eliminar datos de prueba
# ============================================
echo -e "\n${YELLOW}========== CLEANUP (opcional) ==========${NC}"

# echo -e "\n${GREEN}DELETE /tour-package-items/:id${NC}"
# curl -s -X DELETE $BASE_URL/tour-package-items/$ITEM_ID \
#   -H "Authorization: Bearer $TOKEN"
# echo ""

# echo -e "\n${GREEN}DELETE /tour-packages/:id${NC}"
# curl -s -X DELETE $BASE_URL/tour-packages/$PACKAGE_ID \
#   -H "Authorization: Bearer $TOKEN"
# echo ""

# echo -e "\n${GREEN}DELETE /promotions/:id${NC}"
# curl -s -X DELETE $BASE_URL/promotions/$PROMO_ID \
#   -H "Authorization: Bearer $TOKEN"
# echo ""

# echo -e "\n${GREEN}DELETE /tours/:id${NC}"
# curl -s -X DELETE $BASE_URL/tours/$TOUR_ID \
#   -H "Authorization: Bearer $TOKEN"
# echo ""

echo -e "\n${BLUE}============================================${NC}"
echo -e "${BLUE}    TESTS COMPLETADOS${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "\nIDs creados durante el test:"
echo -e "  TOUR_ID: $TOUR_ID"
echo -e "  PACKAGE_ID: $PACKAGE_ID"
echo -e "  ITEM_ID: $ITEM_ID"
echo -e "  PROMO_ID: $PROMO_ID"
echo -e "  RESERVATION_ID: $RESERVATION_ID"
echo -e "  DOC_ID: $DOC_ID"
echo -e "\nRevisa las tablas correspondientes en PostgreSQL para ver los resultados."
