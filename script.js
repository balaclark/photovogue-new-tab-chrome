(async () => {
  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const today = new Date();

  const fetchData = async () => {
    const [isoDate] = today.toISOString().split("T");
    const url = `https://api.vogue.com/production/photos?count=1&date_from=${isoDate}&date_to=${isoDate}&feature=true&locale=en-us&type_ids=3`;

    const res = await fetch(url);
    const data = await res.json();

    return data.items[0];
  };

  const render = ({ title, photographer, gallery_image, themes }) => {
    document.getElementById("day").textContent = formatDate(today);
    document.getElementById("title").textContent = title;
    const photograherName = document.getElementById("photographerName");
    photograherName.textContent = photographer.name;
    photograherName.href = `https://www.vogue.com/photovogue/photographers/${photographer.id}`;
    const biography = document.getElementById("photographerBiography");
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
    document.getElementById("photographerCity").textContent = photographer.city;
    document.getElementById("main-image").src = gallery_image;
    document.getElementById("avatar").src = photographer.avatar;
    themes.forEach((theme) => {
      const el = document.createElement("strong");
      el.textContent = `#${theme.text} `;
      document.getElementById("themes").appendChild(el);
    });
  };

  console.log("fetching data…");

  const data = await fetchData();

  console.log(data);

  render(data);
})();
