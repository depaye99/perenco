// Gestion des PIDs pour la plateforme PERENCO
document.addEventListener("DOMContentLoaded", () => {
  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  if (isAuthenticated) {
    // Initialiser la page de gestion des PIDs
    initPIDManagement()
  }

  // Ajouter les styles CSS pour la gestion des PIDs
  addPIDManagementStyles()
})

// Fonction pour ajouter les styles CSS
function addPIDManagementStyles() {
  if (!document.getElementById("pid-management-styles")) {
    const link = document.createElement("link")
    link.id = "pid-management-styles"
    link.rel = "stylesheet"
    link.href = "css/pid-management.css"
    document.head.appendChild(link)
  }
}

// Structure de données hiérarchique (simulée)
const hierarchyData = {
  fields: [
    {
      id: "field1",
      name: "Moudi",
      zones: [
        {
          id: "zone1",
          name: "Zone Offshore",
          platforms: [
            {
              id: "platform1",
              name: "VT",
              pids: [
                { id: "pid1", name: "Séparateur HP", number: "CM-MOUDI-VT-AA-001", status: "verified" },
                { id: "pid2", name: "Séparateur BP", number: "CM-MOUDI-VT-AA-002", status: "pending" },
                { id: "pid3", name: "Compresseur", number: "CM-MOUDI-VT-AB-001", status: "pending" },
              ],
            },
            {
              id: "platform2",
              name: "BAP",
              pids: [
                { id: "pid4", name: "Séparateur Test", number: "CM-MOUDI-BAP-AA-001", status: "verified" },
                { id: "pid5", name: "Pompe Export", number: "CM-MOUDI-BAP-AB-001", status: "pending" },
              ],
            },
          ],
        },
        {
          id: "zone2",
          name: "Zone Onshore",
          platforms: [
            {
              id: "platform3",
              name: "ESP1",
              pids: [
                { id: "pid6", name: "Traitement Eau", number: "CM-MOUDI-ESP1-AA-001", status: "verified" },
                { id: "pid7", name: "Injection Eau", number: "CM-MOUDI-ESP1-AB-001", status: "pending" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "field2",
      name: "Kole",
      zones: [
        {
          id: "zone3",
          name: "Zone Principale",
          platforms: [
            {
              id: "platform4",
              name: "KLF1",
              pids: [
                { id: "pid8", name: "Séparateur Principal", number: "CM-KOLE-KLF1-AA-001", status: "verified" },
                { id: "pid9", name: "Système Gaz Lift", number: "CM-KOLE-KLF1-AB-001", status: "pending" },
              ],
            },
          ],
        },
      ],
    },
  ],
}

// Variables pour la navigation
let currentLevel = "field" // field, zone, platform, pid
let currentParent = null
let breadcrumbPath = []
let currentItems = []
let filteredItems = []

// Variables pour la pagination
let currentPage = 1
const itemsPerPage = 10

// Fonction d'initialisation
function initPIDManagement() {
  // Initialiser les gestionnaires d'événements
  initEventListeners()

  // Charger les données initiales (niveau champ)
  loadHierarchyLevel("field", null)

  // Initialiser les filtres
  initFilters()
}

// Initialiser les gestionnaires d'événements
function initEventListeners() {
  // Bouton de retour
  document.getElementById("back-button").addEventListener("click", navigateBack)

  // Bouton d'ajout
  document.getElementById("add-item-button").addEventListener("click", () => showAddModal())

  // Bouton d'importation
  document.getElementById("import-button").addEventListener("click", showImportModal)

  // Bouton d'exportation
  document.getElementById("export-button").addEventListener("click", exportData)

  // Recherche
  document.getElementById("search-input").addEventListener("input", handleSearch)
  document.getElementById("search-button").addEventListener("click", handleSearch)

  // Réinitialisation des filtres
  document.getElementById("reset-filters").addEventListener("click", resetFilters)

  // Filtres
  document.getElementById("filter-zone").addEventListener("change", applyFilters)
  document.getElementById("filter-status").addEventListener("change", applyFilters)
  document.getElementById("filter-field").addEventListener("change", applyFilters)

  // Pagination
  document.getElementById("prev-page").addEventListener("click", () => changePage(currentPage - 1))
  document.getElementById("next-page").addEventListener("click", () => changePage(currentPage + 1))

  // Modals
  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", closeAllModals)
  })

  document.getElementById("cancel-button").addEventListener("click", closeAllModals)
  document.getElementById("add-edit-form").addEventListener("submit", handleFormSubmit)

  document.getElementById("cancel-delete").addEventListener("click", closeAllModals)
  document.getElementById("confirm-delete").addEventListener("click", handleDelete)

  // Import modal
  document.getElementById("browse-file").addEventListener("click", () => {
    document.getElementById("import-file").click()
  })

  document.getElementById("import-file").addEventListener("change", handleFileSelect)
  document.getElementById("cancel-import").addEventListener("click", closeAllModals)
  document.getElementById("confirm-import").addEventListener("click", handleImport)
}

// Initialiser les filtres
function initFilters() {
  // Remplir les filtres de zones
  const zoneFilter = document.getElementById("filter-zone")
  const zones = getAllZones()
  zoneFilter.innerHTML = '<option value="">Toutes les zones</option>'
  zones.forEach((zone) => {
    const option = document.createElement("option")
    option.value = zone.id
    option.textContent = zone.name
    zoneFilter.appendChild(option)
  })

  // Remplir les filtres de champs
  const fieldFilter = document.getElementById("filter-field")
  fieldFilter.innerHTML = '<option value="">Tous les champs</option>'
  hierarchyData.fields.forEach((field) => {
    const option = document.createElement("option")
    option.value = field.id
    option.textContent = field.name
    fieldFilter.appendChild(option)
  })
}

// Obtenir toutes les zones
function getAllZones() {
  const zones = []
  hierarchyData.fields.forEach((field) => {
    field.zones.forEach((zone) => {
      zones.push({
        id: zone.id,
        name: `${field.name} - ${zone.name}`,
      })
    })
  })
  return zones
}

// Charger un niveau de la hiérarchie
function loadHierarchyLevel(level, parentId) {
  currentLevel = level
  currentParent = parentId

  // Mettre à jour le titre du niveau actuel
  const levelTitles = {
    field: "Champs",
    zone: "Zones",
    platform: "Plateformes",
    pid: "PIDs",
  }
  document.getElementById("current-level").textContent = levelTitles[level]

  // Mettre à jour le chemin de navigation
  updateBreadcrumb()

  // Activer/désactiver le bouton de retour
  document.getElementById("back-button").disabled = level === "field"

  // Charger les éléments du niveau actuel
  loadItems(level, parentId)

  // Afficher/masquer le tableau des PIDs
  document.getElementById("pid-table-container").style.display = level === "pid" ? "block" : "none"
  document.getElementById("hierarchy-items").style.display = level === "pid" ? "none" : "grid"
}

// Mettre à jour le chemin de navigation
function updateBreadcrumb() {
  const breadcrumbElement = document.getElementById("breadcrumb-path")

  if (breadcrumbPath.length === 0) {
    breadcrumbElement.textContent = ""
    return
  }

  breadcrumbElement.textContent = " > " + breadcrumbPath.map((item) => item.name).join(" > ")
}

// Charger les éléments du niveau actuel
function loadItems(level, parentId) {
  let items = []

  switch (level) {
    case "field":
      items = hierarchyData.fields
      break
    case "zone":
      const field = hierarchyData.fields.find((f) => f.id === parentId)
      if (field) items = field.zones
      break
    case "platform":
      let platforms = []
      hierarchyData.fields.forEach((field) => {
        field.zones.forEach((zone) => {
          if (zone.id === parentId) {
            platforms = zone.platforms
          }
        })
      })
      items = platforms
      break
    case "pid":
      let pids = []
      hierarchyData.fields.forEach((field) => {
        field.zones.forEach((zone) => {
          zone.platforms.forEach((platform) => {
            if (platform.id === parentId) {
              pids = platform.pids.map((pid) => ({
                ...pid,
                platform: platform.name,
                zone: zone.name,
                field: field.name,
              }))
            }
          })
        })
      })
      items = pids
      break
  }

  currentItems = items
  filteredItems = [...items]

  // Réinitialiser la pagination
  currentPage = 1

  // Afficher les éléments
  if (level === "pid") {
    renderPIDTable(items)
  } else {
    renderHierarchyItems(items, level)
  }
}

// Rendre les éléments de la hiérarchie
function renderHierarchyItems(items, level) {
  const container = document.getElementById("hierarchy-items")
  container.innerHTML = ""

  if (items.length === 0) {
    container.innerHTML = `<div class="empty-state">
            <i class="fas fa-folder-open"></i>
            <p>Aucun élément trouvé</p>
        </div>`
    return
  }

  items.forEach((item) => {
    const itemElement = document.createElement("div")
    itemElement.className = "hierarchy-item"

    // Déterminer l'icône et le compteur en fonction du niveau
    let icon, countLabel, countValue
    switch (level) {
      case "field":
        icon = "fa-map-marker-alt"
        countLabel = "Zones"
        countValue = item.zones.length
        break
      case "zone":
        icon = "fa-layer-group"
        countLabel = "Plateformes"
        countValue = item.platforms.length
        break
      case "platform":
        icon = "fa-project-diagram"
        countLabel = "PIDs"
        countValue = item.pids.length
        break
    }

    itemElement.innerHTML = `
            <div class="hierarchy-item-header">
                <div class="hierarchy-item-title">${item.name}</div>
                <div class="hierarchy-item-icon"><i class="fas ${icon}"></i></div>
            </div>
            <div class="hierarchy-item-content">
                ${level === "platform" ? `<p>Plateforme ${item.name}</p>` : ""}
            </div>
            <div class="hierarchy-item-footer">
                <div class="hierarchy-item-count">${countLabel}: ${countValue}</div>
            </div>
            <div class="hierarchy-item-actions">
                <button class="item-action-btn edit-btn" title="Modifier" data-id="${item.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="item-action-btn delete-btn" title="Supprimer" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `

    // Ajouter l'événement de clic pour naviguer
    itemElement.addEventListener("click", (e) => {
      // Ne pas naviguer si on a cliqué sur un bouton d'action
      if (e.target.closest(".item-action-btn")) return

      navigateTo(item, level)
    })

    // Ajouter les gestionnaires d'événements pour les boutons d'action
    const editBtn = itemElement.querySelector(".edit-btn")
    if (editBtn) {
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        showEditModal(item, level)
      })
    }

    const deleteBtn = itemElement.querySelector(".delete-btn")
    if (deleteBtn) {
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        showDeleteModal(item.id, level)
      })
    }

    container.appendChild(itemElement)
  })
}

// Rendre le tableau des PIDs
function renderPIDTable(pids) {
  const tableBody = document.getElementById("pid-table-body")
  tableBody.innerHTML = ""

  // Calculer les éléments à afficher pour la pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, pids.length)
  const paginatedPids = pids.slice(startIndex, endIndex)

  // Mettre à jour les informations de pagination
  document.getElementById("showing-start").textContent = pids.length > 0 ? startIndex + 1 : 0
  document.getElementById("showing-end").textContent = endIndex
  document.getElementById("total-items").textContent = pids.length

  // Mettre à jour les contrôles de pagination
  updatePaginationControls(pids.length)

  if (pids.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="empty-table">Aucun PID trouvé</td></tr>`
    return
  }

  paginatedPids.forEach((pid) => {
    const row = document.createElement("tr")

    row.innerHTML = `
            <td>${pid.name}</td>
            <td>${pid.number}</td>
            <td>${pid.platform}</td>
            <td>${pid.zone}</td>
            <td>${pid.field}</td>
            <td><span class="status-badge ${pid.status}">${pid.status === "verified" ? "Vérifié" : "En attente"}</span></td>
            <td>
                <div class="table-actions">
                    <button class="table-action-btn edit" title="Modifier" data-id="${pid.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="table-action-btn delete" title="Supprimer" data-id="${pid.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `

    // Ajouter les gestionnaires d'événements pour les boutons d'action
    const editBtn = row.querySelector(".edit")
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        showEditModal(pid, "pid")
      })
    }

    const deleteBtn = row.querySelector(".delete")
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        showDeleteModal(pid.id, "pid")
      })
    }

    tableBody.appendChild(row)
  })
}

// Mettre à jour les contrôles de pagination
function updatePaginationControls(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginationNumbers = document.getElementById("pagination-numbers")
  paginationNumbers.innerHTML = ""

  // Désactiver/activer les boutons précédent/suivant
  document.getElementById("prev-page").disabled = currentPage === 1
  document.getElementById("next-page").disabled = currentPage === totalPages || totalPages === 0

  // Générer les numéros de page
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button")
    pageButton.className = `page-number ${i === currentPage ? "active" : ""}`
    pageButton.textContent = i
    pageButton.addEventListener("click", () => changePage(i))
    paginationNumbers.appendChild(pageButton)
  }
}

// Changer de page
function changePage(page) {
  currentPage = page
  renderPIDTable(filteredItems)
}

// Naviguer vers un niveau inférieur
function navigateTo(item, currentLevel) {
  let nextLevel

  switch (currentLevel) {
    case "field":
      nextLevel = "zone"
      breadcrumbPath = [{ id: item.id, name: item.name }]
      break
    case "zone":
      nextLevel = "platform"
      // Trouver le champ parent
      const field = hierarchyData.fields.find((f) => f.zones.some((z) => z.id === item.id))
      breadcrumbPath = [
        { id: field.id, name: field.name },
        { id: item.id, name: item.name },
      ]
      break
    case "platform":
      nextLevel = "pid"
      // Trouver le champ et la zone parents
      let parentField, parentZone
      hierarchyData.fields.forEach((f) => {
        f.zones.forEach((z) => {
          if (z.platforms.some((p) => p.id === item.id)) {
            parentField = f
            parentZone = z
          }
        })
      })
      breadcrumbPath = [
        { id: parentField.id, name: parentField.name },
        { id: parentZone.id, name: parentZone.name },
        { id: item.id, name: item.name },
      ]
      break
  }

  loadHierarchyLevel(nextLevel, item.id)
}

// Naviguer vers un niveau supérieur
function navigateBack() {
  let prevLevel, parentId

  switch (currentLevel) {
    case "zone":
      prevLevel = "field"
      parentId = null
      breadcrumbPath = []
      break
    case "platform":
      prevLevel = "zone"
      parentId = breadcrumbPath[0].id
      breadcrumbPath = breadcrumbPath.slice(0, 1)
      break
    case "pid":
      prevLevel = "platform"
      parentId = breadcrumbPath[1].id
      breadcrumbPath = breadcrumbPath.slice(0, 2)
      break
    default:
      return
  }

  loadHierarchyLevel(prevLevel, parentId)
}

// Gérer la recherche
function handleSearch() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase()

  if (currentLevel === "pid") {
    // Filtrer les PIDs
    filteredItems = currentItems.filter(
      (pid) => pid.name.toLowerCase().includes(searchTerm) || pid.number.toLowerCase().includes(searchTerm),
    )
    renderPIDTable(filteredItems)
  } else {
    // Filtrer les éléments de la hiérarchie
    filteredItems = currentItems.filter((item) => item.name.toLowerCase().includes(searchTerm))
    renderHierarchyItems(filteredItems, currentLevel)
  }
}

// Appliquer les filtres
function applyFilters() {
  const zoneFilter = document.getElementById("filter-zone").value
  const statusFilter = document.getElementById("filter-status").value
  const fieldFilter = document.getElementById("filter-field").value

  // Si nous sommes au niveau PID, filtrer les PIDs
  if (currentLevel === "pid") {
    filteredItems = currentItems.filter((pid) => {
      let matchZone = true,
        matchStatus = true,
        matchField = true

      // Trouver la zone et le champ pour ce PID
      hierarchyData.fields.forEach((field) => {
        field.zones.forEach((zone) => {
          zone.platforms.forEach((platform) => {
            if (platform.name === pid.platform) {
              if (zoneFilter && zone.id !== zoneFilter) matchZone = false
              if (fieldFilter && field.id !== fieldFilter) matchField = false
            }
          })
        })
      })

      if (statusFilter && pid.status !== statusFilter) matchStatus = false

      return matchZone && matchStatus && matchField
    })

    renderPIDTable(filteredItems)
  } else {
    // Pour les autres niveaux, nous pourrions implémenter un filtrage spécifique
    // Pour l'instant, nous réinitialisons simplement les filtres
    filteredItems = [...currentItems]
    renderHierarchyItems(filteredItems, currentLevel)
  }
}

// Réinitialiser les filtres
function resetFilters() {
  document.getElementById("filter-zone").value = ""
  document.getElementById("filter-status").value = ""
  document.getElementById("filter-field").value = ""
  document.getElementById("search-input").value = ""

  filteredItems = [...currentItems]

  if (currentLevel === "pid") {
    renderPIDTable(filteredItems)
  } else {
    renderHierarchyItems(filteredItems, currentLevel)
  }
}

// Afficher le modal d'ajout
function showAddModal() {
  const modal = document.getElementById("add-modal")
  const modalTitle = document.getElementById("modal-title")
  const form = document.getElementById("add-edit-form")

  // Réinitialiser le formulaire
  form.reset()

  // Configurer le modal en fonction du niveau actuel
  let itemType
  switch (currentLevel) {
    case "field":
      itemType = "Champ"
      document.getElementById("number-group").style.display = "none"
      document.getElementById("status-group").style.display = "none"
      break
    case "zone":
      itemType = "Zone"
      document.getElementById("number-group").style.display = "none"
      document.getElementById("status-group").style.display = "none"
      break
    case "platform":
      itemType = "Plateforme"
      document.getElementById("number-group").style.display = "none"
      document.getElementById("status-group").style.display = "none"
      break
    case "pid":
      itemType = "PID"
      document.getElementById("number-group").style.display = "block"
      document.getElementById("status-group").style.display = "block"
      break
  }

  modalTitle.textContent = `Ajouter un ${itemType}`

  // Définir le type d'élément et le parent
  document.getElementById("item-type").value = currentLevel
  document.getElementById("parent-id").value = currentParent
  document.getElementById("item-id").value = ""

  // Afficher le modal
  modal.style.display = "block"
}

// Afficher le modal de modification
function showEditModal(item, level) {
  const modal = document.getElementById("add-modal")
  const modalTitle = document.getElementById("modal-title")
  const form = document.getElementById("add-edit-form")

  // Configurer le modal en fonction du niveau
  let itemType
  switch (level) {
    case "field":
      itemType = "Champ"
      document.getElementById("number-group").style.display = "none"
      document.getElementById("status-group").style.display = "none"
      break
    case "zone":
      itemType = "Zone"
      document.getElementById("number-group").style.display = "none"
      document.getElementById("status-group").style.display = "none"
      break
    case "platform":
      itemType = "Plateforme"
      document.getElementById("number-group").style.display = "none"
      document.getElementById("status-group").style.display = "none"
      break
    case "pid":
      itemType = "PID"
      document.getElementById("number-group").style.display = "block"
      document.getElementById("status-group").style.display = "block"
      break
  }

  modalTitle.textContent = `Modifier un ${itemType}`

  // Remplir le formulaire avec les données de l'élément
  document.getElementById("item-name").value = item.name
  if (level === "pid") {
    document.getElementById("item-number").value = item.number
    document.getElementById("item-status").value = item.status
  }

  // Définir l'ID de l'élément, le type et le parent
  document.getElementById("item-id").value = item.id
  document.getElementById("item-type").value = level
  document.getElementById("parent-id").value = currentParent

  // Afficher le modal
  modal.style.display = "block"
}

// Afficher le modal de suppression
function showDeleteModal(itemId, level) {
  const modal = document.getElementById("delete-modal")

  // Définir l'ID de l'élément et le type
  document.getElementById("delete-item-id").value = itemId
  document.getElementById("delete-item-type").value = level

  // Afficher le modal
  modal.style.display = "block"
}

// Afficher le modal d'importation
function showImportModal() {
  const modal = document.getElementById("import-modal")

  // Réinitialiser le formulaire
  document.getElementById("import-level").value = currentLevel
  document.getElementById("import-file").value = ""
  document.getElementById("selected-filename").textContent = "Aucun fichier sélectionné"
  document.getElementById("import-preview").style.display = "none"
  document.getElementById("confirm-import").disabled = true

  // Afficher le modal
  modal.style.display = "block"
}

// Fermer tous les modals
function closeAllModals() {
  const modals = document.querySelectorAll(".modal")
  modals.forEach((modal) => {
    modal.style.display = "none"
  })
}

// Gérer la soumission du formulaire
function handleFormSubmit(e) {
  e.preventDefault()

  const itemId = document.getElementById("item-id").value
  const itemType = document.getElementById("item-type").value
  const parentId = document.getElementById("parent-id").value
  const name = document.getElementById("item-name").value

  // Si c'est une modification
  if (itemId) {
    updateItem(itemId, itemType, name)
  } else {
    // Si c'est un ajout
    addItem(itemType, parentId, name)
  }

  // Fermer le modal
  closeAllModals()

  // Recharger les données
  loadHierarchyLevel(currentLevel, currentParent)
}

// Ajouter un élément
function addItem(type, parentId, name) {
  const newId = generateId()

  switch (type) {
    case "field":
      hierarchyData.fields.push({
        id: newId,
        name: name,
        zones: [],
      })
      break
    case "zone":
      const field = hierarchyData.fields.find((f) => f.id === parentId)
      if (field) {
        field.zones.push({
          id: newId,
          name: name,
          platforms: [],
        })
      }
      break
    case "platform":
      hierarchyData.fields.forEach((field) => {
        field.zones.forEach((zone) => {
          if (zone.id === parentId) {
            zone.platforms.push({
              id: newId,
              name: name,
              pids: [],
            })
          }
        })
      })
      break
    case "pid":
      const number = document.getElementById("item-number").value
      const status = document.getElementById("item-status").value

      hierarchyData.fields.forEach((field) => {
        field.zones.forEach((zone) => {
          zone.platforms.forEach((platform) => {
            if (platform.id === parentId) {
              platform.pids.push({
                id: newId,
                name: name,
                number: number,
                status: status,
              })
            }
          })
        })
      })
      break
  }

  // Afficher un message de succès
  alert(`${name} a été ajouté avec succès.`)
}

// Mettre à jour un élément
function updateItem(itemId, type, name) {
  switch (type) {
    case "field":
      const field = hierarchyData.fields.find((f) => f.id === itemId)
      if (field) field.name = name
      break
    case "zone":
      hierarchyData.fields.forEach((field) => {
        const zone = field.zones.find((z) => z.id === itemId)
        if (zone) zone.name = name
      })
      break
    case "platform":
      hierarchyData.fields.forEach((field) => {
        field.zones.forEach((zone) => {
          const platform = zone.platforms.find((p) => p.id === itemId)
          if (platform) platform.name = name
        })
      })
      break
    case "pid":
      const number = document.getElementById("item-number").value
      const status = document.getElementById("item-status").value

      hierarchyData.fields.forEach((field) => {
        field.zones.forEach((zone) => {
          zone.platforms.forEach((platform) => {
            const pid = platform.pids.find((p) => p.id === itemId)
            if (pid) {
              pid.name = name
              pid.number = number
              pid.status = status
            }
          })
        })
      })
      break
  }

  // Afficher un message de succès
  alert(`${name} a été mis à jour avec succès.`)
}

// Supprimer un élément
function handleDelete() {
  const itemId = document.getElementById("delete-item-id").value
  const itemType = document.getElementById("delete-item-type").value

  deleteItem(itemId, itemType)

  // Fermer le modal
  closeAllModals()

  // Recharger les données
  loadHierarchyLevel(currentLevel, currentParent)
}

// Supprimer un élément
function deleteItem(itemId, type) {
  let itemName = ""

  switch (type) {
    case "field":
      const fieldIndex = hierarchyData.fields.findIndex((f) => f.id === itemId)
      if (fieldIndex !== -1) {
        itemName = hierarchyData.fields[fieldIndex].name
        hierarchyData.fields.splice(fieldIndex, 1)
      }
      break
    case "zone":
      hierarchyData.fields.forEach((field) => {
        const zoneIndex = field.zones.findIndex((z) => z.id === itemId)
        if (zoneIndex !== -1) {
          itemName = field.zones[zoneIndex].name
          field.zones.splice(zoneIndex, 1)
        }
      })
      break
    case "platform":
      hierarchyData.fields.forEach((field) => {
        field.zones.forEach((zone) => {
          const platformIndex = zone.platforms.findIndex((p) => p.id === itemId)
          if (platformIndex !== -1) {
            itemName = zone.platforms[platformIndex].name
            zone.platforms.splice(platformIndex, 1)
          }
        })
      })
      break
    case "pid":
      hierarchyData.fields.forEach((field) => {
        field.zones.forEach((zone) => {
          zone.platforms.forEach((platform) => {
            const pidIndex = platform.pids.findIndex((p) => p.id === itemId)
            if (pidIndex !== -1) {
              itemName = platform.pids[pidIndex].name
              platform.pids.splice(pidIndex, 1)
            }
          })
        })
      })
      break
  }

  // Afficher un message de succès
  alert(`${itemName} a été supprimé avec succès.`)
}

// Déclarer la variable XLSX
/* global XLSX */

// Gérer la sélection de fichier pour l'importation
function handleFileSelect(e) {
  const file = e.target.files[0]
  if (!file) return

  document.getElementById("selected-filename").textContent = file.name

  // Vérifier le type de fichier
  if (!file.name.match(/\.(xlsx|xls)$/)) {
    alert("Veuillez sélectionner un fichier Excel (.xlsx ou .xls)")
    return
  }

  // Lire le fichier avec SheetJS
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: "array" })

      // Prendre la première feuille
      const firstSheet = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheet]

      // Convertir en JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      // Afficher l'aperçu
      showImportPreview(jsonData)

      // Activer le bouton d'importation
      document.getElementById("confirm-import").disabled = false
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier Excel:", error)
      alert("Erreur lors de la lecture du fichier Excel. Veuillez vérifier que le fichier n'est pas corrompu.")
    }
  }

  reader.readAsArrayBuffer(file)
}

// Afficher l'aperçu des données à importer
function showImportPreview(data) {
  if (!data || data.length === 0) {
    alert("Le fichier ne contient pas de données valides.")
    return
  }

  const previewDiv = document.getElementById("import-preview")
  const previewTable = document.getElementById("preview-table")

  // Créer les en-têtes du tableau
  const headers = Object.keys(data[0])
  const thead = previewTable.querySelector("thead")
  thead.innerHTML = ""

  const headerRow = document.createElement("tr")
  headers.forEach((header) => {
    const th = document.createElement("th")
    th.textContent = header
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)

  // Créer les lignes de données
  const tbody = previewTable.querySelector("tbody")
  tbody.innerHTML = ""

  // Limiter à 5 lignes pour l'aperçu
  const previewData = data.slice(0, 5)

  previewData.forEach((row) => {
    const tr = document.createElement("tr")

    headers.forEach((header) => {
      const td = document.createElement("td")
      td.textContent = row[header] || ""
      tr.appendChild(td)
    })

    tbody.appendChild(tr)
  })

  // Afficher l'aperçu
  previewDiv.style.display = "block"
}

// Gérer l'importation des données
function handleImport() {
  // Dans une application réelle, vous implémenteriez ici la logique pour traiter
  // les données du fichier Excel et les ajouter à votre structure de données

  alert("Importation réussie !")
  closeAllModals()

  // Recharger les données
  loadHierarchyLevel(currentLevel, currentParent)
}

// Exporter les données
function exportData() {
  // Déterminer quelles données exporter en fonction du niveau actuel
  let dataToExport = []
  let filename = ""

  switch (currentLevel) {
    case "field":
      dataToExport = hierarchyData.fields.map((field) => ({
        ID: field.id,
        Nom: field.name,
        "Nombre de zones": field.zones.length,
      }))
      filename = "champs.xlsx"
      break
    case "zone":
      const field = hierarchyData.fields.find((f) => f.id === currentParent)
      dataToExport = field.zones.map((zone) => ({
        ID: zone.id,
        Nom: zone.name,
        Champ: field.name,
        "Nombre de plateformes": zone.platforms.length,
      }))
      filename = `zones_${field.name}.xlsx`
      break
    case "platform":
      let parentField, parentZone
      hierarchyData.fields.forEach((f) => {
        f.zones.forEach((z) => {
          if (z.id === currentParent) {
            parentField = f
            parentZone = z
          }
        })
      })

      dataToExport = parentZone.platforms.map((platform) => ({
        ID: platform.id,
        Nom: platform.name,
        Zone: parentZone.name,
        Champ: parentField.name,
        "Nombre de PIDs": platform.pids.length,
      }))
      filename = `plateformes_${parentZone.name}.xlsx`
      break
    case "pid":
      let pidField, pidZone, pidPlatform
      hierarchyData.fields.forEach((f) => {
        f.zones.forEach((z) => {
          z.platforms.forEach((p) => {
            if (p.id === currentParent) {
              pidField = f
              pidZone = z
              pidPlatform = p
            }
          })
        })
      })

      dataToExport = pidPlatform.pids.map((pid) => ({
        ID: pid.id,
        Nom: pid.name,
        Numéro: pid.number,
        Statut: pid.status === "verified" ? "Vérifié" : "En attente",
        Plateforme: pidPlatform.name,
        Zone: pidZone.name,
        Champ: pidField.name,
      }))
      filename = `pids_${pidPlatform.name}.xlsx`
      break
  }

  // Créer un classeur Excel
  const worksheet = XLSX.utils.json_to_sheet(dataToExport)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Données")

  // Générer le fichier Excel
  XLSX.writeFile(workbook, filename)
}

// Générer un ID unique
function generateId() {
  return "id_" + Math.random().toString(36).substr(2, 9)
}
