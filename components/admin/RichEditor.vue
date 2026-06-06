<template>
  <div class="border border-comma-border-subtle rounded-lg overflow-hidden bg-white">
    <!-- Toolbar -->
    <div v-if="editor" class="flex flex-wrap items-center gap-1 p-2 bg-comma-neutral-50 border-b border-comma-border-subtle">
      <!-- Undo/Redo (already have type) -->
      <button
        type="button"
        @click="editor.chain().focus().undo().run()"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors disabled:opacity-30"
        :disabled="!editor.can().undo()"
        title="Undo"
      >
        <Icon name="mdi:undo" class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().redo().run()"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors disabled:opacity-30"
        :disabled="!editor.can().redo()"
        title="Redo"
      >
        <Icon name="mdi:redo" class="w-4 h-4" />
      </button>

      <div class="w-px h-6 bg-comma-border-subtle mx-1"></div>

      <!-- Text formatting -->
      <button
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'bg-comma-primary text-white': editor.isActive('bold') }"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Bold"
      >
        <Icon name="mdi:format-bold" class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'bg-comma-primary text-white': editor.isActive('italic') }"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Italic"
      >
        <Icon name="mdi:format-italic" class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleUnderline().run()"
        :class="{ 'bg-comma-primary text-white': editor.isActive('underline') }"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Underline"
      >
        <Icon name="mdi:format-underline" class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'bg-comma-primary text-white': editor.isActive('strike') }"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Strikethrough"
      >
        <Icon name="mdi:format-strikethrough-variant" class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleCode().run()"
        :class="{ 'bg-comma-primary text-white': editor.isActive('code') }"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Inline code"
      >
        <Icon name="tabler:code" class="w-4 h-4" />
      </button>

      <div class="w-px h-6 bg-comma-border-subtle mx-1"></div>

      <!-- Headings dropdown (already not a button) -->
      <USelectMenu
        :options="headingOptions"
        value-attribute="value"
        option-attribute="label"
        placeholder="Normal"
        size="xs"
        class="w-28"
        :model-value="getCurrentHeading()"
        @update:model-value="setHeading"
      />

      <div class="w-px h-6 bg-comma-border-subtle mx-1"></div>

      <!-- Text color popover (inner buttons need type) -->
      <UPopover mode="click">
        <button type="button" class="p-2 rounded hover:bg-comma-primary/10 transition-colors" title="Text color">
          <div class="flex items-center gap-1">
            <Icon name="mdi:palette" class="w-4 h-4" />
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: currentColor }"></div>
          </div>
        </button>
        <template #panel>
          <div class="p-2 grid grid-cols-6 gap-1 w-48">
            <button
              v-for="color in colorOptions"
              :key="color"
              type="button"
              @click="setColor(color)"
              class="w-6 h-6 rounded-full border border-comma-border-subtle hover:scale-110 transition-transform"
              :style="{ backgroundColor: color }"
            ></button>
            <button
              type="button"
              @click="setColor(null)"
              class="col-span-6 mt-1 text-xs text-comma-neutral-600 hover:text-comma-primary"
            >
              {{ $t('admin.rich_editor.remove_color') }}
            </button>
          </div>
        </template>
      </UPopover>

      <!-- Highlight popover (inner buttons need type) -->
      <UPopover mode="click">
        <button type="button" class="p-2 rounded hover:bg-comma-primary/10 transition-colors" title="Highlight">
          <div class="flex items-center gap-1">
            <Icon name="mdi:marker" class="w-4 h-4" />
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: currentHighlight }"></div>
          </div>
        </button>
        <template #panel>
          <div class="p-2 grid grid-cols-6 gap-1 w-48">
            <button
              v-for="color in highlightOptions"
              :key="color"
              type="button"
              @click="setHighlight(color)"
              class="w-6 h-6 rounded-full border border-comma-border-subtle hover:scale-110 transition-transform"
              :style="{ backgroundColor: color }"
            ></button>
            <button
              type="button"
              @click="setHighlight(null)"
              class="col-span-6 mt-1 text-xs text-comma-neutral-600 hover:text-comma-primary"
            >
              {{ $t('admin.rich_editor.remove_highlight') }}
            </button>
          </div>
        </template>
      </UPopover>

      <div class="w-px h-6 bg-comma-border-subtle mx-1"></div>

      <!-- Alignment -->
      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('left').run()"
        :class="{ 'bg-comma-primary text-white': editor.isActive({ textAlign: 'left' }) }"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Align left"
      >
        <Icon name="mdi:format-align-left" class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('center').run()"
        :class="{ 'bg-comma-primary text-white': editor.isActive({ textAlign: 'center' }) }"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Center"
      >
        <Icon name="mdi:format-align-center" class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('right').run()"
        :class="{ 'bg-comma-primary text-white': editor.isActive({ textAlign: 'right' }) }"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Align right"
      >
        <Icon name="mdi:format-align-right" class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('justify').run()"
        :class="{ 'bg-comma-primary text-white': editor.isActive({ textAlign: 'justify' }) }"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Justify"
      >
        <Icon name="mdi:format-align-justify" class="w-4 h-4" />
      </button>

      <div class="w-px h-6 bg-comma-border-subtle mx-1"></div>

      <!-- Lists -->
      <button
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-comma-primary text-white': editor.isActive('bulletList') }"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Bullet list"
      >
        <Icon name="mdi:format-list-bulleted" class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-comma-primary text-white': editor.isActive('orderedList') }"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Numbered list"
      >
        <Icon name="mdi:format-list-numbered" class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleTaskList().run()"
        :class="{ 'bg-comma-primary text-white': editor.isActive('taskList') }"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Task list"
      >
        <Icon name="mdi:checkbox-marked-outline" class="w-4 h-4" />
      </button>

      <div class="w-px h-6 bg-comma-border-subtle mx-1"></div>

      <!-- Indent -->
      <button
        type="button"
        @click="editor.chain().focus().sinkListItem('listItem').run()"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Indent"
      >
        <Icon name="mdi:format-indent-increase" class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().liftListItem('listItem').run()"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Outdent"
      >
        <Icon name="mdi:format-indent-decrease" class="w-4 h-4" />
      </button>

      <div class="w-px h-6 bg-comma-border-subtle mx-1"></div>

      <!-- Link & Image -->
      <button
        type="button"
        @click="setLink"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Insert link"
      >
        <Icon name="mdi:link-variant" class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="addImage"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Insert image"
      >
        <Icon name="mdi:image-outline" class="w-4 h-4" />
      </button>

      <div class="w-px h-6 bg-comma-border-subtle mx-1"></div>

      <!-- Blocks -->
      <button
        type="button"
        @click="editor.chain().focus().toggleCodeBlock().run()"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Code block"
      >
        <Icon name="mdi:code-tags" class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleBlockquote().run()"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Blockquote"
      >
        <Icon name="mdi:format-quote-close" class="w-4 h-4" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().setHorizontalRule().run()"
        class="p-2 rounded hover:bg-comma-primary/10 transition-colors"
        title="Horizontal rule"
      >
        <Icon name="mdi:minus" class="w-4 h-4" />
      </button>

      <div class="w-px h-6 bg-comma-border-subtle mx-1"></div>

      <!-- Table -->
      <button type="button" @click="insertTable" class="p-2 rounded hover:bg-comma-primary/10" title="Insert table">
        <Icon name="mdi:table" class="w-4 h-4" />
      </button>
      <button
        v-if="editor.isActive('table')"
        type="button"
        @click="editor.chain().focus().addColumnBefore().run()"
        class="p-2"
        title="Add column before"
      >
        <Icon name="mdi:table-column-plus-before" class="w-4 h-4" />
      </button>
      <button
        v-if="editor.isActive('table')"
        type="button"
        @click="editor.chain().focus().addColumnAfter().run()"
        class="p-2"
        title="Add column after"
      >
        <Icon name="mdi:table-column-plus-after" class="w-4 h-4" />
      </button>
      <button
        v-if="editor.isActive('table')"
        type="button"
        @click="editor.chain().focus().deleteColumn().run()"
        class="p-2"
        title="Delete column"
      >
        <Icon name="mdi:table-column-remove" class="w-4 h-4" />
      </button>
      <button
        v-if="editor.isActive('table')"
        type="button"
        @click="editor.chain().focus().addRowBefore().run()"
        class="p-2"
        title="Add row before"
      >
        <Icon name="mdi:table-row-plus-before" class="w-4 h-4" />
      </button>
      <button
        v-if="editor.isActive('table')"
        type="button"
        @click="editor.chain().focus().addRowAfter().run()"
        class="p-2"
        title="Add row after"
      >
        <Icon name="mdi:table-row-plus-after" class="w-4 h-4" />
      </button>
      <button
        v-if="editor.isActive('table')"
        type="button"
        @click="editor.chain().focus().deleteRow().run()"
        class="p-2"
        title="Delete row"
      >
        <Icon name="mdi:table-row-remove" class="w-4 h-4" />
      </button>
      <button
        v-if="editor.isActive('table')"
        type="button"
        @click="editor.chain().focus().deleteTable().run()"
        class="p-2"
        title="Delete table"
      >
        <Icon name="mdi:table-remove" class="w-4 h-4" />
      </button>

      <div class="w-px h-6 bg-comma-border-subtle mx-1"></div>

      <!-- Clear -->
      <button
        type="button"
        @click="editor.chain().focus().clearNodes().unsetAllMarks().run()"
        class="p-2 rounded hover:bg-comma-primary/10"
        title="Clear formatting"
      >
        <Icon name="mdi:format-clear" class="w-4 h-4" />
      </button>
    </div>

    <!-- Editor -->
    <editor-content :editor="editor" class="prose max-w-none p-4 min-h-[300px]" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CodeBlock from '@tiptap/extension-code-block'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Start writing...',
  },
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      codeBlock: false,
    }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Link.configure({
      openOnClick: false,
    }),
    Image,
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    CodeBlock,
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    Typography,
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.getHTML() !== newValue) {
    editor.value.commands.setContent(newValue, false)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const headingOptions = [
  { label: 'Normal', value: 'paragraph' },
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
  { label: 'Heading 4', value: 'h4' },
]

const getCurrentHeading = () => {
  if (!editor.value) return 'paragraph'
  if (editor.value.isActive('heading', { level: 1 })) return 'h1'
  if (editor.value.isActive('heading', { level: 2 })) return 'h2'
  if (editor.value.isActive('heading', { level: 3 })) return 'h3'
  if (editor.value.isActive('heading', { level: 4 })) return 'h4'
  return 'paragraph'
}

const setHeading = (value: string) => {
  if (!editor.value) return
  if (value === 'paragraph') {
    editor.value.chain().focus().setParagraph().run()
  } else {
    const level = parseInt(value.substring(1)) as 1 | 2 | 3 | 4
    editor.value.chain().focus().setHeading({ level }).run()
  }
}

const colorOptions = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc',
  '#d73a49', '#f97583', '#ffd33d', '#f9c513', '#34d058', '#28a745',
  '#0366d6', '#2188ff', '#6f42c1', '#b392f0', '#e36209', '#ffab70',
]

const highlightOptions = [
  '#ffffaa', '#aaffaa', '#aaddff', '#ffaaff', '#ffccaa', '#ffaaaa',
  '#aaeeff', '#cceecc', '#ffe0b0', '#f0b0f0', '#b0b0ff', '#f0f0b0',
]

const currentColor = computed(() => {
  if (!editor.value) return '#000000'
  return editor.value.getAttributes('textStyle').color || '#000000'
})

const currentHighlight = computed(() => {
  if (!editor.value) return 'transparent'
  return editor.value.getAttributes('highlight').color || 'transparent'
})

const setColor = (color: string | null) => {
  if (!editor.value) return
  if (color) {
    editor.value.chain().focus().setColor(color).run()
  } else {
    editor.value.chain().focus().unsetColor().run()
  }
}

const setHighlight = (color: string | null) => {
  if (!editor.value) return
  if (color) {
    editor.value.chain().focus().setHighlight({ color }).run()
  } else {
    editor.value.chain().focus().unsetHighlight().run()
  }
}

const setLink = () => {
  if (!editor.value) return
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('URL:', previousUrl)
  if (url === null) return
  if (url === '') {
    editor.value.chain().focus().unsetLink().run()
    return
  }
  editor.value.chain().focus().setLink({ href: url }).run()
}

const addImage = () => {
  if (!editor.value) return
  const url = window.prompt('Image URL:')
  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

const insertTable = () => {
  if (!editor.value) return
  editor.value.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
}
</script>

<style>
.ProseMirror {
  outline: none;
  min-height: 300px;
}

.ProseMirror p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

/* Table styles */
.ProseMirror table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 1rem 0;
}
.ProseMirror td,
.ProseMirror th {
  border: 2px solid #ced4da;
  padding: 0.5rem;
  position: relative;
}
.ProseMirror th {
  background-color: #f8f9fa;
  font-weight: bold;
}
.ProseMirror .selectedCell:after {
  background: rgba(200, 200, 255, 0.4);
  content: "";
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  position: absolute;
  z-index: 2;
}

/* Code block */
.ProseMirror pre {
  background: #0d0d0d;
  border-radius: 0.5rem;
  color: #fff;
  padding: 0.75rem 1rem;
}
.ProseMirror code {
  background: none;
  color: inherit;
  font-size: 0.8rem;
  padding: 0;
}

/* Task list */
.ProseMirror ul[data-type="taskList"] {
  list-style: none;
  padding: 0;
}
.ProseMirror ul[data-type="taskList"] li {
  display: flex;
  align-items: flex-start;
}
.ProseMirror ul[data-type="taskList"] li > label {
  flex: 0 0 auto;
  margin-right: 0.5rem;
  user-select: none;
}
.ProseMirror ul[data-type="taskList"] li > div {
  flex: 1 1 auto;
}
</style>