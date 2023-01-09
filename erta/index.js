// ICONS
const studentIcon = `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
<path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
</svg>`;

const teacherIcon = `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
<path fill="currentColor" d="M20 22H4V20C4 17.8 7.6 16 12 16S20 17.8 20 20M8 9H16V10C16 12.2 14.2 14 12 14S8 12.2 8 10M19 4C18.4 4 18 4.4 18 5V6H16.5L15.1 3C15 2.8 14.9 2.6 14.7 2.5C14.2 2 13.4 1.9 12.7 2.2L12 2.4L11.3 2.1C10.6 1.8 9.8 1.9 9.3 2.4C9.1 2.6 9 2.8 8.9 3L7.5 6H6V5C6 4.4 5.6 4 5 4S4 4.4 4 5V6C4 7.1 4.9 8 6 8H18C19.1 8 20 7.1 20 6V5C20 4.5 19.6 4 19 4Z" />
</svg>`;

const removeIcon = `<svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
<path
  fill="currentColor"
  d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
/>
</svg>`;

// ALL HTML ELEMENTS NEEDED (const = will never change)
const nameInput = document.querySelector("#name-input");
const roleSelect = document.querySelector("#role-select");
const submitBtn = document.querySelector("#submit-button");
const membersList = document.querySelector("#members-list");
const searchInput = document.querySelector("#search-input");
const deleteBtn = document.querySelector("#remove-button");

// JS VARIABLES
const members = [];
let filteredMembers = [];

// EVENT LISTENERS
submitBtn.addEventListener("click", onSubmit);
document.addEventListener("keydown", listenForEnter);
searchInput.addEventListener("input", searchAndRenderMembers);

function listenForEnter(event) {
	if (event.key === "Enter") onSubmit();
}

function onSubmit() {
	// emri eshte vlera e inputit ose nese ska vlere inputi nje string bosh
	// trim() heq hapesirat e para dhe pas stringut
	const name = (nameInput.value ?? "").trim();
	const role = roleSelect.value;
	// Nese nuk ka vlere emri ose roli, mos vazhdo
	if (!name || !role) return;
	// Krijo nje objekt me te dhenat e memberit
	const member = {
		role,
		name,
		id: Date.now(),
	};
	// Shto objektin tek array members
	members.push(member);
	// Ruaj te dhenat ne localStorage
	localStorage.setItem("members", JSON.stringify(members));
	// Shfaqe memberin ne HTML
	renderMember(member);
	// Pastro inputin
	nameInput.value = "";
	roleSelect.value = "student";
}

/**
 * Ky funksion thirret ne fillim per te marre te dhenat nga
 * localStorage dhe per ti vendosur ne JS si dhe per ti shfaqur ne HTML
 *  */
function init() {
	const storedSearch = JSON.parse(localStorage.getItem("search"));
	if (storedSearch) searchInput.value = storedSearch;
	const storedMembers = JSON.parse(localStorage.getItem("members"));
	// Nese te dhenat e ruajtura ne localStorage jane array
	if (Array.isArray(storedMembers)) {
		// Ruaji tek kjo variabel ne JS
		members.push(...storedMembers);
		filteredMembers.push(...storedMembers);
		searchAndRenderMembers();
	}
}

// Renderizon shume members ne HTML
function renderMembers() {
	// Fshije te gjithe memberet e listes qe jane aktualisht ne HTML
	membersList.innerHTML = "";
	// Shfaq
	filteredMembers.forEach((member) => renderMember(member));
}

// Renderizon nje member ne HTML
function renderMember(member) {
	// Krijo nje element li
	const li = document.createElement("li");
	li.classList.add("member");
	li.setAttribute("id", `member-${member.id}`);
	// Pjesa e majte (ikona, emri dhe roli)
	const leftPart = document.createElement("div");
	leftPart.classList.add("member-left-part");
	const memberIcon = member.role === "student" ? studentIcon : teacherIcon;
	leftPart.innerHTML = memberIcon;
	const data = document.createElement("div");
	const name = document.createElement("h3");
	name.classList.add("member-name");
	name.innerText = member.name;
	const role = document.createElement("p");
	role.innerText = member.role;
	data.appendChild(name);
	data.appendChild(role);
	leftPart.appendChild(data);
	// Pjesa e djathte (butoni qe fshin)
	const removeButton = document.createElement("button");
	removeButton.classList.add("remove-button");
	removeButton.addEventListener("click", () => removeMember(member.id));
	removeButton.innerHTML = removeIcon;
	// Duke vendosur copezat e li tek li
	li.appendChild(leftPart);
	li.appendChild(removeButton);
	// Duke e futur tek lista ul
	membersList.appendChild(li);
}

function removeMember(id) {
	const memberIndex = members.findIndex((member) => member.id === id);
	if (memberIndex === -1) return;
	// Remove from HTML
	const member = document.querySelector(`#member-${id}`);
	member.remove();
	// Remove from JS
	members.splice(memberIndex, 1);
	// Remove from localStorage
	localStorage.setItem("members", JSON.stringify(members));
}

function searchAndRenderMembers() {
	const searchValue = (searchInput.value ?? "").trim().toLowerCase();
	// Ruaj ne localStorage vlere e inputit
	localStorage.setItem("search", JSON.stringify(searchInput.value));
	// Nese nuk ka vlere ne input, shfaq te gjithe memberet
	if (!searchValue) {
		filteredMembers = [...members];
	} else {
		// Filtro memberet qe permbajne kete vlere
		filteredMembers = members.filter((member) =>
			member.name.trim().toLowerCase().includes(searchValue)
		);
	}
	renderMembers();
}

init();
