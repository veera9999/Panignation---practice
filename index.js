document.addEventListener("DOMContentLoaded", function () {
  const apiURL = "https://jsonplaceholder.typicode.com/todos";
  let currentPage = 1;
  const rowsPerPage = 10;
  let totalPages;
  let data = [];

  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const pageButtonsContainer = document.querySelector(".page-buttons");
  const tableBody = document.querySelector("#data-table");

  // Function to fetch data from the API
  function fetchData() {
    fetch(apiURL)
      .then((response) => response.json())
      .then((fetchedData) => {
        data = fetchedData;
        totalPages = Math.ceil(data.length / rowsPerPage);
        updatePagination();
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  // Function to populate the table with data
  function populateTable(page) {
    tableBody.innerHTML = ""; // Clear existing data
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.userId}</td>
        <td>${item.id}</td>
        <td>${item.title}</td>
        <td>${item.completed ? "Yes" : "No"}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Function to update pagination buttons state and page info
  function updatePagination() {
    populateTable(currentPage);
    updatePageButtons();
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  // Add this function to your existing JavaScript
  function updatePageButtons() {
    pageButtonsContainer.innerHTML = "";
    const maxVisibleButtons = window.innerWidth < 768 ? 2 : 4;
    const halfVisible = Math.floor(maxVisibleButtons / 2);
    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(endPage - maxVisibleButtons + 1, 1);
    }

    if (startPage > 1) {
      addPageButton(1);
      if (startPage > 2) {
        addEllipsis();
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      addPageButton(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        addEllipsis();
      }
      addPageButton(totalPages);
    }
  }

  function addPageButton(pageNum) {
    const pageButton = document.createElement("button");
    pageButton.textContent = pageNum;
    pageButton.classList.add("page-number");
    if (pageNum === currentPage) {
      pageButton.classList.add("active");
    }
    pageButton.addEventListener("click", () => {
      currentPage = pageNum;
      updatePagination();
    });
    pageButtonsContainer.appendChild(pageButton);
  }

  function addEllipsis() {
    const ellipsis = document.createElement("span");
    ellipsis.textContent = "...";
    ellipsis.classList.add("ellipsis");
    pageButtonsContainer.appendChild(ellipsis);
  }

  // Event listeners for previous and next buttons
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updatePagination();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      updatePagination();
    }
  });

  // Fetch and display data on page load
  fetchData();

  // Add this event listener to handle window resizing
  window.addEventListener("resize", updatePagination);
});
