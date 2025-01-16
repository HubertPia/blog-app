// Add
const createModal = document.getElementById("createPostModal");
const createOverlay = document.getElementById("modalOverlayCreate");
const openCreateModalBtn = document.getElementById("openCreateModal");
const closeCreateModalBtn = document.getElementById("closeCreateModal");
const saveCreatePostBtn = document.getElementById("saveCreatePost");
const createPostTitleInput = document.getElementById("createPostTitle");
const createPostContentInput = document.getElementById("createPostContent");

// Edit
const editModal = document.getElementById("editPostModal");
const editOverlay = document.getElementById("modalOverlayEdit");
const closeEditModalBtn = document.getElementById("closeEditModal");
const saveEditPostBtn = document.getElementById("saveEditPost");
const editPostTitleInput = document.getElementById("editPostTitle");
const editPostContentInput = document.getElementById("editPostContent");

const postsContainer = document.getElementById("postsContainer");

let postToEdit = null;

function openCreateModal() {
  createModal.classList.add("active");
  createOverlay.classList.add("active");
}

function closeCreateModal() {
  createModal.classList.remove("active");
  createOverlay.classList.remove("active");
  createPostTitleInput.value = "";
  createPostContentInput.value = "";
}

function saveCreatePost() {
  const title = createPostTitleInput.value.trim();
  const content = createPostContentInput.value.trim();

  if (!title || !content) {
    alert("Proszę wypełnić oba pola!");
    return;
  }

  const postElement = document.createElement("div");
  postElement.classList.add("post");
  postElement.innerHTML = `
        <h3>${title}</h3>
        <p>${content}</p>
        <button class="editPost">Edytuj</button>
        <button class="deletePost">Usuń</button>
    `;

  postElement
    .querySelector(".editPost")
    .addEventListener("click", () => openEditModal(postElement));
  postElement
    .querySelector(".deletePost")
    .addEventListener("click", () => deletePost(postElement));

  postsContainer.prepend(postElement);

  closeCreateModal();
}

function openEditModal(postElement) {
  postToEdit = postElement;
  const titleElement = postElement.querySelector("h3");
  const contentElement = postElement.querySelector("p");

  editPostTitleInput.value = titleElement.textContent;
  editPostContentInput.value = contentElement.textContent;

  editModal.classList.add("active");
  editOverlay.classList.add("active");
}

function closeEditModal() {
  editModal.classList.remove("active");
  editOverlay.classList.remove("active");
  editPostTitleInput.value = "";
  editPostContentInput.value = "";
  postToEdit = null;
}

function saveEditPost() {
  const title = editPostTitleInput.value.trim();
  const content = editPostContentInput.value.trim();

  if (!title || !content) {
    alert("Proszę wypełnić oba pola!");
    return;
  }

  if (postToEdit) {
    const titleElement = postToEdit.querySelector("h3");
    const contentElement = postToEdit.querySelector("p");
    titleElement.textContent = title;
    contentElement.textContent = content;
  }

  closeEditModal();
}

function deletePost(postElement) {
  postsContainer.removeChild(postElement);
}

openCreateModalBtn.addEventListener("click", openCreateModal);
closeCreateModalBtn.addEventListener("click", closeCreateModal);
createOverlay.addEventListener("click", closeCreateModal);
saveCreatePostBtn.addEventListener("click", saveCreatePost);

closeEditModalBtn.addEventListener("click", closeEditModal);
editOverlay.addEventListener("click", closeEditModal);
saveEditPostBtn.addEventListener("click", saveEditPost);
