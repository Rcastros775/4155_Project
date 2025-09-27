document.addEventListener("DOMContentLoaded", () => {

  const genderBtns = document.querySelectorAll(".gender-btn");
  genderBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      genderBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });


  const accordionHeaders = document.querySelectorAll(".accordion-header");
  accordionHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      item.classList.toggle("active");
    });
  });

 
  const tabs = document.querySelectorAll(".tabs");
  tabs.forEach(tabSet => {
    const buttons = tabSet.querySelectorAll(".tab-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        
        buttons.forEach(b => b.classList.remove("active"));
        tabSet.parentElement.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        
        btn.classList.add("active");
        const tabId = btn.getAttribute("data-tab");
        tabSet.parentElement.querySelector(`#${tabId}`).classList.add("active");
      });
    });
  });
});
