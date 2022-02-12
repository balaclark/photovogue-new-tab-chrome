(async () => {
  const form = document.forms.options;
  const options = await chrome.storage.sync.get();

  form.querySelector('select[name="theme"]').value = options.theme || "compact";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);

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
