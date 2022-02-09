(() => {
  const form = document.forms.options;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);

    console.log(data.get("theme"));

    chrome.storage.sync.set(
      {
        theme: data.get("theme"),
      },
      () => {
        alert("saved");
      }
    );
  });
})();
