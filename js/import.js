document.addEventListener("DOMContentLoaded", () => {
  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  if (isAuthenticated) {
    // Initialiser la page d'importation
    initImportPage()
  }
})

function initImportPage() {
  // Référence aux éléments du DOM
  const dropArea = document.getElementById("drop-area")
  const fileInput = document.getElementById("fileInput")
  const browseBtn = document.getElementById("browseBtn")
  const selectedFileDiv = document.getElementById("selected-file")
  const fileName = document.getElementById("file-name")
  const fileSize = document.getElementById("file-size")
  const removeFileBtn = document.getElementById("remove-file")
  const sheetSelect = document.getElementById("sheet-select")
  const importBtn = document.getElementById("import-btn")
  const cancelBtn = document.getElementById("cancel-btn")
  const previewDiv = document.getElementById("import-preview")
  const previewTable = document.getElementById("preview-table")
  const prevPageBtn = document.getElementById("prev-page")
  const nextPageBtn = document.getElementById("next-page")
  const currentPageSpan = document.getElementById("current-page")
  const showingStart = document.getElementById("showing-start")
  const showingEnd = document.getElementById("showing-end")
  const totalRows = document.getElementById("total-rows")

  // Variables pour stocker les données
  let excelData = null
  let currentPage = 1
  const rowsPerPage = 10

  // Gestionnaire d'événements pour le bouton Parcourir
  if (browseBtn) {
    browseBtn.addEventListener("click", () => {
      fileInput.click()
    })
  }

  // Gestionnaire d'événements pour le changement de fichier
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      if (this.files.length > 0) {
        handleFile(this.files[0])
      }
    })
  }

  // Gestionnaire d'événements pour le glisser-déposer
  if (dropArea) {
    ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false)
    })

    function preventDefaults(e) {
      e.preventDefault()
      e.stopPropagation()
    }
    ;["dragenter", "dragover"].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight, false)
    })
    ;["dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, unhighlight, false)
    })

    function highlight() {
      dropArea.classList.add("dragover")
    }

    function unhighlight() {
      dropArea.classList.remove("dragover")
    }

    dropArea.addEventListener("drop", (e) => {
      const dt = e.dataTransfer
      const files = dt.files

      if (files.length > 0) {
        handleFile(files[0])
      }
    })
  }

  // Gestionnaire d'événements pour supprimer le fichier
  if (removeFileBtn) {
    removeFileBtn.addEventListener("click", () => {
      // Réinitialiser le formulaire
      fileInput.value = ""
      selectedFileDiv.style.display = "none"
      dropArea.style.display = "block"
      sheetSelect.innerHTML = '<option value="">Sélectionnez un fichier d\'abord</option>'
      sheetSelect.disabled = true
      importBtn.disabled = true
      previewDiv.style.display = "none"
      excelData = null
    })
  }

  // Gestionnaire d'événements pour le bouton Annuler
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      // Réinitialiser le formulaire
      fileInput.value = ""
      selectedFileDiv.style.display = "none"
      dropArea.style.display = "block"
      sheetSelect.innerHTML = '<option value="">Sélectionnez un fichier d\'abord</option>'
      sheetSelect.disabled = true
      importBtn.disabled = true
      previewDiv.style.display = "none"
      excelData = null
    })
  }

  // Gestionnaire d'événements pour le bouton Importer
  if (importBtn) {
    importBtn.addEventListener("click", () => {
      // Simuler l'importation
      alert("Importation réussie!")

      // Réinitialiser le formulaire
      fileInput.value = ""
      selectedFileDiv.style.display = "none"
      dropArea.style.display = "block"
      sheetSelect.innerHTML = '<option value="">Sélectionnez un fichier d\'abord</option>'
      sheetSelect.disabled = true
      importBtn.disabled = true
      previewDiv.style.display = "none"
      excelData = null
    })
  }

  // Gestionnaire d'événements pour le changement de feuille Excel
  if (sheetSelect) {
    sheetSelect.addEventListener("change", function () {
      if (this.value && excelData && excelData[this.value]) {
        displayPreview(excelData[this.value])
      }
    })
  }

  // Gestionnaire d'événements pour la pagination
  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--
        updatePagination()
        displayCurrentPage()
      }
    })
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      const selectedSheet = sheetSelect.value
      if (excelData && excelData[selectedSheet]) {
        const totalPages = Math.ceil(excelData[selectedSheet].length / rowsPerPage)
        if (currentPage < totalPages) {
          currentPage++
          updatePagination()
          displayCurrentPage()
        }
      }
    })
  }

  // Fonction pour traiter le fichier Excel
  function handleFile(file) {
    // Vérifier le type de fichier
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      alert("Veuillez sélectionner un fichier Excel (.xlsx ou .xls)")
      return
    }

    // Afficher les informations du fichier
    fileName.textContent = file.name
    fileSize.textContent = formatFileSize(file.size)
    selectedFileDiv.style.display = "flex"
    dropArea.style.display = "none"

    // Lire le fichier avec SheetJS
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        /* set up XMLHttpRequest */
        var url = e.target.result
        var workbook = XLSX.read(url, { type: "binary" })

        // Extraire les données
        excelData = {}
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName]
          excelData[sheetName] = XLSX.utils.sheet_to_json(worksheet)
        })

        // Remplir le sélecteur de feuilles
        sheetSelect.innerHTML = ""
        workbook.SheetNames.forEach((sheetName) => {
          const option = document.createElement("option")
          option.value = sheetName
          option.textContent = sheetName
          sheetSelect.appendChild(option)
        })

        sheetSelect.disabled = false

        // Afficher un aperçu de la première feuille
        if (workbook.SheetNames.length > 0) {
          const firstSheet = workbook.SheetNames[0]
          sheetSelect.value = firstSheet
          displayPreview(excelData[firstSheet])
        }

        // Activer le bouton d'importation
        importBtn.disabled = false
      } catch (error) {
        console.error("Erreur lors de la lecture du fichier Excel:", error)
        alert("Erreur lors de la lecture du fichier Excel. Veuillez vérifier que le fichier n'est pas corrompu.")
      }
    }

    reader.readAsBinaryString(file)
  }

  // Fonction pour afficher l'aperçu des données
  function displayPreview(data) {
    if (!data || data.length === 0) {
      previewDiv.style.display = "none"
      return
    }

    // Réinitialiser la pagination
    currentPage = 1

    // Mettre à jour le nombre total de lignes
    if (totalRows) {
      totalRows.textContent = data.length
    }

    // Afficher l'aperçu
    previewDiv.style.display = "block"

    // Mettre à jour la pagination
    updatePagination()

    // Afficher la première page
    displayCurrentPage()
  }

  // Fonction pour afficher la page actuelle
  function displayCurrentPage() {
    const selectedSheet = sheetSelect.value
    if (!excelData || !excelData[selectedSheet]) return

    const data = excelData[selectedSheet]
    const start = (currentPage - 1) * rowsPerPage
    const end = Math.min(start + rowsPerPage, data.length)
    const currentPageData = data.slice(start, end)

    // Mettre à jour les informations de pagination
    if (showingStart) showingStart.textContent = start + 1
    if (showingEnd) showingEnd.textContent = end
    if (currentPageSpan) currentPageSpan.textContent = currentPage

    // Construire le tableau d'aperçu
    const tbody = previewTable.querySelector("tbody")
    tbody.innerHTML = ""

    currentPageData.forEach((row) => {
      const tr = document.createElement("tr")

      // Pour cet exemple, nous supposons que les données ont une certaine structure
      // Vous devrez adapter cela en fonction de la structure réelle de vos données
      const platformCol = document.createElement("td")
      platformCol.textContent = row.Plateforme || row.plateforme || ""
      tr.appendChild(platformCol)

      const nameCol = document.createElement("td")
      nameCol.textContent = row.Nom || row.nom || row.NomPID || ""
      tr.appendChild(nameCol)

      const idCol = document.createElement("td")
      idCol.textContent = row.Numero || row.numero || row.ID || ""
      tr.appendChild(idCol)

      const statusCol = document.createElement("td")
      const status = row.Statut || row.statut || "Non vérifié"
      statusCol.innerHTML = `<span class="status-badge ${status.toLowerCase().replace(" ", "-")}">${status}</span>`
      tr.appendChild(statusCol)

      tbody.appendChild(tr)
    })
  }

  // Fonction pour mettre à jour les contrôles de pagination
  function updatePagination() {
    const selectedSheet = sheetSelect.value
    if (!excelData || !excelData[selectedSheet]) return

    const data = excelData[selectedSheet]
    const totalPages = Math.ceil(data.length / rowsPerPage)

    // Mettre à jour les états des boutons de pagination
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages
  }

  // Fonction pour formater la taille du fichier
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
}
