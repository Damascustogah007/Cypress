function markdownReporter(reportObj) {
  const markdownResult = []
  let totalDuration = 0

  reportObj.results.forEach((resultItem) => {
    console.log(resultItem.uuid)

    resultItem.suites.forEach((suiteItem) => {
      const suiteArray = suiteItem.title.split(' @@ ')
      const suiteTestSpecName = suiteArray[0]
      const suiteTitle = suiteArray[1]

      markdownResult.push(`### ${suiteTestSpecName}`)
      markdownResult.push(`*${suiteTitle}*`)
      markdownResult.push('| Nr. | Test | Status | Duration |')
      markdownResult.push('| --- | --- | --- | --- |')

      suiteItem.tests.forEach((testItem, index) => {
        const { title, duration, speed, state, pass, fail } = testItem
        totalDuration += parseInt(duration)
        const icon = pass ? '✅' : '❌'
        const strLine = `| ${index + 1} | ${title} | ${icon} | ${duration}ms |`
        markdownResult.push(strLine)
      })
    })
  })
  markdownResult.push(`Total duration: ${totalDuration / 1000} .s`)
  return markdownResult.join('\n')
}

exports.markdownReporter = markdownReporter
