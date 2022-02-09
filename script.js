(async () => {
  const days = 4;

  const options = await chrome.storage.sync.get();

  const formatDate = (date) => {
    const options = {
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - days);

  const fetchData = async () => {
    const [todayIsoDate] = today.toISOString().split("T");
    const [pastIsoDate] = past.toISOString().split("T");
    const url = `https://api.vogue.com/production/photos?count=${days}&date_from=${pastIsoDate}&date_to=${todayIsoDate}&feature=true&locale=en-us&type_ids=3`;

    const res = await fetch(url);
    const data = await res.json();

    return data.items;
  };

  const renderPhoto = (
    parentEl,
    { id, title, photographer, themes, daily_date, ...data },
    { imageKey = "gallery_image" } = {}
  ) => {
    parentEl.querySelector(".day").textContent = formatDate(
      new Date(daily_date)
    );
    parentEl.querySelector(".photo-title").textContent = title;

    parentEl.querySelector(
      ".main-image-link"
    ).href = `https://www.vogue.com/photovogue/photos/pic-of-the-day/gallery#${id}`;

    parentEl.querySelector(".photographerLink").onclick = () =>
      (window.location = `https://www.vogue.com/photovogue/photographers/${photographer.id}`);

    const photograherName = parentEl.querySelector(".photographerName");
    photograherName.textContent = photographer.name;
    photograherName.href = `https://www.vogue.com/photovogue/photographers/${photographer.id}`;

    const biography = parentEl.querySelector(".photographerBiography");
    biography.textContent = photographer.biography;

    if (photographer.websites.length) {
      const websiteList = document.createElement("ul");
      biography.appendChild(websiteList);
      photographer.websites.forEach((website) => {
        const link = document.createElement("a");
        link.href = website;
        link.textContent = website;
        const li = document.createElement("li");
        li.appendChild(link);
        websiteList.appendChild(li);
      });
    }

    parentEl.querySelector(".photographerCity").textContent = photographer.city;
    parentEl.querySelector(".main-image").src = data[imageKey];
    parentEl.querySelector(".avatar").src = photographer.avatar;

    themes.forEach((theme) => {
      const el = document.createElement("strong");
      el.textContent = `#${theme.text.toLowerCase()} `;
      parentEl.querySelector(".themes").appendChild(el);
    });
  };

  const data = await fetchData();

  const renderLarge = () => {
    const [todaysPic, ...prevPics] = data;
    renderPhoto(document.getElementById("today"), todaysPic);

    const parent = document.querySelector(
      '[data-theme="large"] .is-one-quarter'
    );
    const prevPicEl = parent.querySelector(".prev-day");
    const more = parent.querySelector(".more");

    prevPics.forEach((data, index) => {
      if (!index) {
        renderPhoto(prevPicEl, data, { imageKey: "thumbnail_image" });
        return;
      }
      const el = prevPicEl.cloneNode(true);
      renderPhoto(el, data, { imageKey: "thumbnail_image" });
      parent.insertBefore(el, more);
    });
  };

  const renderCompact = () => {
    const parent = document.querySelector('[data-theme="compact"] .columns');
    const first = parent.querySelector(".column:first-child");
    const more = parent.querySelector(".more");

    data.forEach((pic, index) => {
      if (!index) {
        renderPhoto(first, pic, { imageKey: "thumbnail_image" });
        return;
      }
      const next = first.cloneNode(true);
      renderPhoto(next, pic, { imageKey: "thumbnail_image" });
      parent.insertBefore(next, more);
    });
  };

  const render = {
    compact: renderCompact,
    large: renderLarge,
  };

  document
    .querySelector(`[data-theme="${options.theme}"]`)
    .classList.remove("is-hidden");

  render[options.theme]();
  // TODO hide loader, show content
})();
