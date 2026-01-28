Hace falta poner los auth y permisos, pero si no se pueden solo omitir porque hay que configurar cosas en el front pq quité algunos porque no funcionaban


alex_frontend{
    tours cliente y admin
    reservas cliente y admin
    promociones cliente y admin
    reembolsos cliente y admin
    cupones cliente y admin
}

luis_frontend{
    change-password                         Done
    recover-password                        Done
    register client                         Done
    login                                   Done
    listar tours admin y cliente            Done
    crear tour admin                        Done
    administradores admin                   Done
    alojamientos admin y cliente (reservas) Done
    auditoría admin                         Done
    cabañas admin y cliente                 Done
    calendario admin y cliente              Done
    checkin admin y cliente                 Done
    clientes admin                          Done
    clima admin y cliente                   Done
    comidas admin y cliente                 Done
    consultas admin y cliente               Done
    guias admin y cliente                   Done
    inventario admin                        Done
    perfil admin y cliente                  Done
    políticas admin y cliente               Done
    preguntas admin y cliente               Done
    puntos de encuentro admin y cliente     Done
    testimonios admin y cliente             Done
}

- volarse cupones                                           Revisar en cliente
- CAMBIAR BOTON EN CABAÑAS/RESERVAS                         Done
- hacer el insert de alex en la seed                        Done
- revisar las incidencias que no salen en cliente view      Done
- meter scroll en craer admin                               Pongamos el navegador en 90% y nos fuimos        
- hacer el home 100% estático excepto por el boton login    Done
- cargar dinámicamente los tours del home                   Done

Permisos:
  (gen_random_uuid(), 'MANAGE_TOURS', 'Gestionar tours y cabañas'),
  (gen_random_uuid(), 'MANAGE_RESERVATIONS', 'Gestionar reservas'),
  (gen_random_uuid(), 'MANAGE_ADMINS', 'Gestionar administradores'),
  (gen_random_uuid(), 'MANAGE_INVENTORY', 'Inventario');