/**
 * 数据导出工具函数
 */

/**
 * 将数据导出为 CSV 文件
 * @param {Array<Object>} data - 数据数组
 * @param {string} filename - 文件名
 * @param {Array<Object>} columns - 列配置 [{ key, label }]
 */
export function exportToCSV(data, filename, columns) {
  // 构建 CSV 内容
  const headers = columns.map(col => col.label).join(',')
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col.key] ?? ''
      // 处理包含逗号或引号的值
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }).join(',')
  })

  const csv = [headers, ...rows].join('\n')

  // 添加 BOM 以支持中文
  const bom = '\uFEFF'
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })

  downloadBlob(blob, filename)
}

/**
 * 将数据导出为 JSON 文件
 * @param {*} data - 数据
 * @param {string} filename - 文件名
 */
export function exportToJSON(data, filename) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })

  downloadBlob(blob, filename)
}

/**
 * 下载 Blob 对象
 * @param {Blob} blob - Blob 对象
 * @param {string} filename - 文件名
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // 释放 URL 对象
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
