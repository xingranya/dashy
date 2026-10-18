import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { nextTick } from 'vue';
import SettingsContainer from '@/components/Settings/SettingsContainer.vue';
import SearchBar from '@/components/Settings/SearchBar.vue';

vi.mock('@/router', () => ({ default: { push: vi.fn() } }));
vi.mock('@/components/Settings/OptionsPanel', () => ({ default: { template: '<div />' } }));
vi.mock('@/components/Configuration/AppInfoModal', () => ({ default: { template: '<div />' } }));
vi.mock('@/components/Configuration/ConfigContainer', () => ({ default: { template: '<div />' } }));
vi.mock('@/components/Settings/LanguageSwitcher', () => ({ default: { template: '<div />' } }));

describe('主页设置入口', () => {
  it('隐藏设置后仍保留搜索，并能恢复设置入口', async () => {
    const store = createStore({
      state: { showSettings: false },
      getters: {
        visibleComponents: state => ({ searchBar: true, settings: state.showSettings }),
        appConfig: () => ({}),
        pageInfo: () => ({}),
        sections: () => [],
      },
    });
    const wrapper = shallowMount(SettingsContainer, {
      global: {
        plugins: [store],
        mocks: { $t: key => key },
        directives: { clickOutside: {}, tooltip: {} },
        stubs: { modal: true, IconOptions: true },
      },
    });
    expect(wrapper.find('.options-trigger').exists()).toBe(false);
    expect(wrapper.findComponent(SearchBar).exists()).toBe(true);
    store.state.showSettings = true;
    await nextTick();
    expect(wrapper.find('.options-trigger').exists()).toBe(true);
    expect(wrapper.findComponent(SearchBar).exists()).toBe(true);
    wrapper.unmount();
  });
});
