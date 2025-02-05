import matter from 'gray-matter'
import { remark } from 'remark'
import strip from 'strip-markdown'

export class BaseDocumentProcessor {
	async process(content) {
		return {
			content: content,
			metadata: {
				type: 'plain',
				timestamp: new Date().toISOString()
			}
		}
	}

	async stripContent(content) {
		return content
	}
}

export class MarkdownDocumentProcessor extends BaseDocumentProcessor {
	async process(content) {
		// Parse frontmatter
		const { data, content: markdownContent } = matter(content)

		// Strip markdown syntax
		const strippedContent = await this.stripContent(markdownContent)

		return {
			content: strippedContent,
			metadata: {
				type: 'markdown',
				title: data.title || 'Untitled',
				date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
				frontmatter: data
			}
		}
	}

	async stripContent(content) {
		const processed = await remark().use(strip).process(content)
		return processed.toString().trim()
	}
}

export class DocumentProcessorFactory {
	static getProcessor(type) {
		switch (type.toLowerCase()) {
			case 'markdown':
			case 'md':
				return new MarkdownDocumentProcessor()
			default:
				return new BaseDocumentProcessor()
		}
	}
}
