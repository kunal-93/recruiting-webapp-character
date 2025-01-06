import { useCallback, useMemo, useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts';
import { Generic } from './types';

const attributesObj: Generic = {}
for (let attr of ATTRIBUTE_LIST) {
  attributesObj[attr] = {
    name: attr,
    modifier: 0,
    value: 0,
    isModifierValid: false
  }
}

const classesMetInitial: Generic = {}
for (let name of Object.keys(CLASS_LIST)) {
  classesMetInitial[name] = false
}

const skillsInitial: Generic = {}
for (let skill of SKILL_LIST) {
  skillsInitial[skill.name] = {
    ...skill,
    total: 0,
    spent: 0,
    modifier: 0
  }
}

function App() {
  const [attributes, setAttributes] = useState(attributesObj)
  const [classes, setClasses] = useState(CLASS_LIST)
  const [classesMet, setClassesMet] = useState(classesMetInitial)
  const [selectedClass, setSelectedClass] = useState('')
  // const [availableSkillPoints, setAvailableSkillPoints] = useState(10)
  const [totalAttrPoints, setTotalAttrPoints] = useState(0)
  const [skills, setSkills] = useState(skillsInitial)

  const modifyAttribute = useCallback((key, isIncrement) => () => {
    const newValue = isIncrement ? attributes[key].value + 1 : attributes[key].value - 1
    const newTotal = totalAttrPoints + (isIncrement ? 1 : -1)

    if (newTotal > 70) {
      alert("A Character can't have more than 70 attribute points")
    } else {
      const modified = {
        ...attributes,
        [key]: {
          ...attributes[key],
          value: newValue,
          modifier: attributes[key].isModifierValid ? Math.floor((newValue - 10) / 2) : 0,
          isModifierValid: newValue >= 10
        }
      }

      let modifiedClassesMet = { ...classesMet }
      for (let cname of Object.keys(classesMet)) {
        let met = true
        for (let attr of Object.keys(classes[cname])) {
          // console.log(classes[cname][attr], attributes[attr].value)
          if (classes[cname][attr] > modified[attr].value) {
            met = false
            break
          }
        }

        if (met) {
          modifiedClassesMet[cname] = true
        } else {
          modifiedClassesMet[cname] = false
        }
      }

      setClassesMet(modifiedClassesMet)

      setTotalAttrPoints(newTotal)

      setAttributes(modified)
    }
  }, [attributes, totalAttrPoints, classes, classesMet])

  const availableSkillPoints = useMemo(() => {
    let base = 10
    let sum = 0
    for (let val of Object.values(attributes)) {
      sum += val.modifier
    }
    let res = base + 4 * sum
    if (res < 0)
      res = 0

    return res
  }, [attributes])

  // const classesMet = useMemo(() => {

  // }, [])

  const spendOnSkill = useCallback((key, isIncrement) => () => {
    const newValue = isIncrement ? skills[key].spent + 1 : attributes[key].spent - 1
    const attrModifier = attributes[skills[key].attributeModifier].modifier
    const modified = {
      ...skills,
      [key]: {
        ...skills[key],
        spent: newValue,
        modifier: attrModifier,
        isModifierValid: newValue + attrModifier
      }
    }

    setSkills(modified)

  }, [attributes, skills])

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
        {/* <div>
          Value:
          {num}
          <button>+</button>
          <button>-</button>
        </div> */}
        <div className='flex'>
          <div className='border'>
            <h2>Attributes</h2>
            <ul>
              {Object.keys(attributes).map((key, i) => {
                const currAttr = attributes[key]
                return (
                  <li key={i}>
                    <span>{currAttr.name}: {currAttr.value} {"(Modifier:"} {currAttr.modifier} {")"}
                      <button onClick={modifyAttribute(key, true)}>+</button>
                      <button onClick={modifyAttribute(key, false)}>-</button>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className='border'>
            <h2>Classes</h2>
            <ul>
              {Object.keys(classes).map((cname, i) => {
                return <li style={{ color: classesMet[cname] ? 'green' : 'white', fontWeight: selectedClass === cname ? 'bold' : 'normal' }} onClick={() => setSelectedClass(cname)} key={i}>{cname}</li>
              })}
            </ul>
          </div>
          {selectedClass ?
            <div className='border'>
              <h2>{selectedClass} Minimum Requirements</h2>
              <ul>
                {Object.entries(classes[selectedClass]).map(([attr, req], i) => {
                  return <li key={i}>{attr}{": "}{req.toString()}</li>
                })}
              </ul>
              <button onClick={() => setSelectedClass('')}>Close Requirements Window</button>
            </div>
            : null
          }
          <div className='border'>
            <h2>Skills</h2>
            <div>Total skill points available: {availableSkillPoints}</div>
            <ul>
              {Object.values(skills).map(({ name, attributeModifier }, i) => {
                return <li key={i}>
                  {name}: {skills[name].spent} {`(Modifier: ${attributeModifier} : ${skills[name].modifier}`} {`Total: ${skills[name].total}`}
                  <button onClick={spendOnSkill(name, true)}>+</button>
                  <button onClick={spendOnSkill(name, false)}>-</button>
                </li>
              })}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
