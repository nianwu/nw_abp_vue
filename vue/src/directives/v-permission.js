import { usePermission } from '@/composables/usePermission';
export const vPermission = {
    mounted(el, binding) {
        if (!binding.value)
            return;
        const { hasPermission } = usePermission();
        if (!hasPermission(binding.value)) {
            el.parentNode?.removeChild(el);
        }
    },
};
