(async () => {
  const days = 3;

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

  const render = (
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

  const [todaysPic, ...prevPics] = await fetchData();

  render(document.getElementById("today"), todaysPic);

  const prevPicEl = document.querySelector(".prev-day");
  const more = document.querySelector(".more");

  prevPics.forEach((data, index) => {
    if (!index) {
      render(prevPicEl, data, { imageKey: "thumbnail_image" });
      return;
    }
    const el = prevPicEl.cloneNode(true);
    render(el, data, { imageKey: "thumbnail_image" });
    prevPicEl.parentNode.insertBefore(el, more);
  });

  // TODO hide loader, show content
})();
