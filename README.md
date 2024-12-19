# Documentation for Photo Tagging Application

This application allows you to tag photos with labels and retrieve them based on those labels. It's a prototype that currently operates without a database, storing data in text files within specific folders.

## Initial Setup

The application starts by defining the initial photo directory (`pasta_fotos` variable) and a MIME type mapping for serving different file types.

## Core Functionality

### Endpoints Activation (`ENDPOINTS_etiqueta`)

The `ENDPOINTS_etiqueta` function dynamically creates endpoints based on the subdirectories present within the "etiquetas" directory. Each subdirectory represents a tag (label).  For each tag, the following endpoints are created:

* `/{tag}/`: Lists untagged photos available for tagging.  Invokes the `GET_listar_fotos` function.
* `/{tag}/registrando/*`:  Registers a photo with the given tag. Uses the `registrando` function.
* `/{tag}/*/*.png/:nova/`: Adds an additional tag to an already tagged photo.  Utilizes the `registrando_mais_etiquetas` function.
* `/{tag}/*`: Serves generic files (images, HTML, etc.) within the tag's directory. Calls the `generico` function.

The function also prints the generated endpoint URLs to the console for easy access.

### Listing Untagged Photos (`GET_listar_fotos`)

This function reads the `pasta_fotos` directory and generates a text file named "lista_arquivos.txt" inside the specified tag's directory.  This file contains a list of all untagged photos (including those in subdirectories). This list is used to present the user with photos available for tagging.

### Tagging Photos (`registrando`)

The `registrando` function adds a photo's path to the "fotos_etiquetadas.txt" file within the corresponding tag's directory. This action effectively tags the photo with that label.

### Adding Multiple Tags (`registrando_mais_etiquetas`)

This function allows adding an additional tag to a photo that already has one or more tags. It appends the photo's path to the "fotos_etiquetadas.txt" file of the new tag's directory. It then redirects to the original request path without the new tag, effectively applying the new tag and returning to the previous context.

### Serving Files (`generico`)

This function serves files based on the requested path. It handles both static files (HTML, JS, CSS) and photos. It includes specific logic to serve photos from the `pasta_fotos` directory and prevents access to files outside designated directories for security.


## Auxiliary Functions

* `listar_fotos`:  Lists all files (including those within subfolders) within a specified directory and writes the paths to a specified output file.
* `getFiles`: Recursively retrieves all files within a given directory and its subdirectories. This is a helper function used by `listar_fotos`.

## Home Page (`pagina_inicial`)

This function serves the initial page of the application. It displays a list of available tags (represented by the subdirectories within the "etiquetas" directory) as links. Each link points to the respective tag's endpoint, allowing the user to view and tag photos associated with that tag.

## Server

The application uses Express.js and listens on port 3001.  The server startup message is printed to the console.


## Data Storage

Currently, the application uses text files ("lista_arquivos.txt" and "fotos_etiquetadas.txt") within each tag's folder to store data. This is a placeholder for a future database implementation.


## Further Development

* Implement a database to replace the current file-based storage.
* Add a user interface for easier tagging and browsing.
* Enhance error handling and security.
* Implement features for removing tags and searching photos by tags.

