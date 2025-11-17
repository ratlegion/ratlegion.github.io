export default function (eleventyConfig) {
  // V Keep /assets and /styles V
  eleventyConfig.addPassthroughCopy({ "source/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "source/styles": "styles" });
  eleventyConfig.addPassthroughCopy({ "source/quiz": "quiz" });

  // V magic? V
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: data => {
      if (data.page.inputPath.endsWith(".html")) {
        return data.page.filePathStem + ".html";
      }
      return data.permalink;
    }
  });

  return {
    dir: {
      input: "source",
      output: "_site"
    }
  };


}
