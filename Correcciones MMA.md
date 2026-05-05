# Correcciones MMA

- [x] Ocultar el nombre del libro del bottom sheet de "Opciones del capítulo"
- [x] Añadir un "Ver más" y "Ver menos" en la descripción
- [x] Opción de "Marcar como visto" y "Marcar como no visto" en las "Opciones del capítulo"
- [x] Guardar el progreso de lectura del capítulo
- [x] Ventana de "No se encontró nada" en la biblioteca
- [x] Un medidor de porcentaje de traducción
- [x] Bug al pasar de capitulo
- [x] Pausar el guardado de posición del visor al minimizar la app
- [x] Al hacer scroll en el bookInfo usar throttle para la animación de la barra de estado
- [x] Ocultar sección "Progreso de traducción" en caso de que los idiomas no estén disponibles
- [x] Ocultar "Marcar como visto" al cambiar de capitulo en el visor
- [x] Priorizar el valor seleccionado del usuario en vez del por defecto en los filtros de busqueda
- [x] Arreglar ripple de los botones en los filtros de busqueda
- [x] Los filtros de "Contenido" no se aplican
- [x] Borrar marco negro de la derecha (posiblemente sea algun calculo de la limitación de handler "pan" [width - width * scale])
- [x] Bajar la sensibilidad de movimiento al hacer zoom
- [ ] Añadir filtro de idioma en MangaDex
- [x] El porcentaje de traducción se calcula por el nivel de opciones no de capitulos traducidos
- [x] En el manga "Takane no Hana wa Fumaretai!" salta un error interno
- [x] Añadir filtro de orden en MangaDex
- [x] Ahora el doble tap no va a dónde se desea ir
- [x] En la lista de capitulos no marca el highlight de opción usada en los capítulos vistos
- [x] Averiguar si se puede marcar el highlight en los capítulos no vistos
- [x] En los capítulos no vistos marcar promedio de las opciones más usadas

- [x] Encoger la imagen de portada en el historial
- [x] Hacer que la sección "Lenguajes" sea opcional a la vista
- [x] Al minimizar la app con el visor abierto, guardar última posición
- [x] Establecer un máximo de "1" en el progreso de visión de un manga

- [x] No aparece el toast de carga en la carga de capitulos
- [x] Ver de precargar las ultimas opciónes vistas en la listas de capitulos para evitar pantallazos

- [ ] Bajar el tiempo de transición de pantalla entre capitulos
- [x] Mostrar un toast cuando no se hayan encontrado opciones en español
- [x] En el historial al pasar de capitulo quedan huecos en blanco

- [x] Hacer que el bottom sheet quede por encima del toast
- [ ] En la descripción aparece la opción de traducción a pesar de ya estar en español
- [ ] Si no hay acciones en el viewer, aparece el titulo de la sección aunque no haya acciones
- [ ] Si hay un solo lenguaje y es español, ocultar el progreso de traducción y la lista de lenguajes

- [ ] En el view al hacer scroll hacia abajo y solar, al volver cancelar la animación

- [ ] Error desconocido en Shadow Manga al filtrar por "Girls Love" y "GL (Girls Love)"

# Cosas a añadir
- [ ] Añadir opción de seleccionar que servicios se quiere usar y ordenar los mismos

- [ ] Añadir seccion "Continuar leyendo" en el inicio (solo si esta guardado por un estado de usuario {"Pendiente", "Leyendo", etc})
- [ ] Añadir seccion "Continuar leyendo" en la ventana de información de un libro

- [x] Opción de ocultar los demás idiomas que no sea español

- [x] Añadir ventana de "Géneros" [Crear método]
- [x] Añadir sección de autores en la vista de información de un libro
- [x] Añadir ventana "Autor" dónde se muestren todas las obras del mismo [Crear método]

- [ ] Implementar el filtro "TEXT" en el bottom sheet de filtros de la biblioteca
- [x] Implementar el filtro "DROPDOWN" en el bottom sheet de filtros de la biblioteca
- [ ] Implementar el filtro "MULTI_DROPDOWN" en el bottom sheet de filtros de la biblioteca
- [x] Implementar el filtro "RADIO" en el bottom sheet de filtros de la biblioteca
- [ ] Implementar el filtro "SELECT_LIST" en el bottom sheet de filtros de la biblioteca

- [ ] Añadir un flag más para ocultar cosas del historial
- [ ] Decoradores para repetir un método en caso de error y otro para trackear el referer

- [ ] Atributo que indique que no debe recomendar opciones en los capítulos
- - [ ] Al abrir un manga precargar el siguiente con este criterio:
    - Verificar si es el único idioma
    - Verificar si es un servicio que no debe tener opciones recomendadas
    - Verificar con última opción elegida
    - Verificar con la opción más elegida
    - Verificar si hay una opción que se ha elegido antes
    - Aleatoria con la fecha más reciente

